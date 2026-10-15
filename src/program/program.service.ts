import { BadRequestException, ConflictException, HttpException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { Program } from './entities/program.entity';



@Injectable()
export class ProgramService {

    private readonly logger = new Logger("ProgramService");

    // TODO Reto 1: inyecta el repositorio de Program (y lo que necesites para las transacciones)
    constructor(
        @InjectRepository(Program)
        private readonly clubRepository: Repository<Program>,
        private readonly datasource: DataSource

    ){}

    // TODO Reto 1: create(createProgramDto, user) -> guarda el programa
    //   - nombre o código repetido -> 409 Conflict (no 500)

    // TODO Reto 1: findAll(paginationDto) -> lista paginada (limit / skip)

    // TODO Reto 2: findOne(id) -> programa con sus estudiantes, 404 si no existe

    // TODO Reto 2: assignStudents(id, assignStudentsDto) -> AGREGA estudiantes al programa
    //   dentro de una transacción (QueryRunner), conservando los que ya tenía.
    //   Mismo patrón del update de estudiantes corregido en clase (combinar las notas):
    //   traer los actuales -> combinar con los nuevos -> guardar la lista completa.
    //   Si algún id no existe: 404 y rollback.

    // TODO Reto 3: bulkCreate(bulkCreateProgramDto, user) -> crea todos los programas o ninguno
    //   (transacción). Cualquier nombre/código repetido -> 409 y rollback.
}
