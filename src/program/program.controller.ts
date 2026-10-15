import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBadRequestResponse, ApiConflictResponse, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProgramService } from './program.service';
import { CreateProgramDto } from './dto/create-program.dto';
import { Program } from './entities/program.entity';
import { Auth } from '../user/decorators/auth.decorator';
import { GetUser } from '../user/decorators/get-user.decorator';
import { ValidRoles } from '../user/enums/valid-roles.enum';
import { User } from '../user/entities/user.entity';
import { AssignStudentsDto } from './dto/assign-students.dto';
import { PaginationDto } from '../student/dto/pagination.dto';


@ApiTags('Programs')
@Controller('program')
export class ProgramController {
  constructor(private readonly programService: ProgramService) {}

  // TODO Reto 1: GET    /api/program               -> listar (paginado con PaginationDto)
  @Post()
  @Auth(ValidRoles.admin)
  create(@Body() createProgramDto: CreateProgramDto, @GetUser() user: User) {
    return this.programService.create(createProgramDto, user);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto){
    return this.programService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.programService.findOne(id);
  }

  @Patch(':id/students')
  @Auth(ValidRoles.admin)
  assignStudents(
    @Param('id') id: string,
    @Body() assignStudentsDto: AssignStudentsDto,
  ) {
    return this.programService.assignStudents(id, assignStudentsDto);
  }

  // TODO Reto 3: POST   /api/program/bulk          -> crear programas en lote (todo o nada)
  // TODO Reto 4: proteger los POST y el PATCH para que solo un admin pueda usarlos
}
