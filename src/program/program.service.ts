import { BadRequestException, ConflictException, HttpException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { Program } from './entities/program.entity';
import { User } from '../user/entities/user.entity';
import { CreateProgramDto } from './dto/create-program.dto';
import { PaginationDto } from '../student/dto/pagination.dto';
import { AssignStudentsDto } from './dto/assign-students.dto';
import { Student } from '../student/entities/student.entity';





@Injectable()
export class ProgramService {

    private readonly logger = new Logger("ProgramService");

    // TODO Reto 1: inyecta el repositorio de Program (y lo que necesites para las transacciones)
    constructor(
        @InjectRepository(Program)
        private readonly programRepository: Repository<Program>,
        private readonly datasource: DataSource

    ){}

    // TODO Reto 1: create(createProgramDto, user) -> guarda el programa
    //   - nombre o código repetido -> 409 Conflict (no 500)
    async create(createProgramDto: CreateProgramDto, user: User){
        try{
            const program = this.programRepository.create({
                ...createProgramDto,
                createdBy: user
            });
            await this.programRepository.save(program);
            return program;
        }catch(error){
            this.handleException(error);
        }
    }

    private handleException(error: any): never{
        if(error instanceof HttpException) throw error;

        if(error.code === '23505')
            throw new ConflictException(error.detail);

        this.logger.error(error);
        throw new InternalServerErrorException('Unexpected error, check server logs');
    }

    // TODO Reto 1: findAll(paginationDto) -> lista paginada (limit / skip)
    // TODO Reto 2: findOne(id) -> programa con sus estudiantes, 404 si no existe
        async findAll(paginationDto: PaginationDto){
        const { limit, skip } = paginationDto;
        return this.programRepository.find({
            take: limit,
            skip: skip
        });
    }

    async findOne(term: string){
        let program: Program | null;

        program = await this.programRepository.findOne({
            where: { id: term },
            relations: { students: true }
        });

        if(!program) throw new NotFoundException(`Program with id ${term} not found`);

        return program;
    }
    
    // TODO Reto 2: assignStudents(id, assignStudentsDto) -> AGREGA estudiantes al programa
    //   dentro de una transacción (QueryRunner), conservando los que ya tenía.
    //   Mismo patrón del update de estudiantes corregido en clase (combinar las notas):
    //   traer los actuales -> combinar con los nuevos -> guardar la lista completa.
    //   Si algún id no existe: 404 y rollback.
    async assignStudents(id: string, assignStudentsDto: AssignStudentsDto): Promise<Program>{
        const queryRunner = this.datasource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try{
            const program = await queryRunner.manager.findOne(Program, {
                where: { id },
                relations: { students: true }
            });
            if(!program) throw new NotFoundException(`Program with id ${id} not found`);

            const requestedIds = [...new Set(assignStudentsDto.studentIds)];
            const students = await queryRunner.manager.find(Student, {
                where: { id: In(requestedIds) }
            });
            if(students.length !== requestedIds.length){
                const foundIds = new Set(students.map((student) => student.id));
                const missingId = requestedIds.find((studentId) => !foundIds.has(studentId));
                throw new NotFoundException(`Student with id ${missingId} not found`);
            }

            const currentStudents = program.students ?? [];
            const currentIds = new Set(currentStudents.map((student) => student.id));
            program.students = [
                ...currentStudents,
                ...students.filter((student) => !currentIds.has(student.id))
            ];

            await queryRunner.manager.save(program);
            await queryRunner.commitTransaction();
            return program;
        }catch(error){
            if(queryRunner.isTransactionActive){
                await queryRunner.rollbackTransaction();
            }
            this.handleException(error);
        }finally{
            await queryRunner.release();
        }
    }

    // TODO Reto 3: bulkCreate(bulkCreateProgramDto, user) -> crea todos los programas o ninguno
    //   (transacción). Cualquier nombre/código repetido -> 409 y rollback.
}
