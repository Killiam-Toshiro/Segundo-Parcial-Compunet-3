import { Body, Controller, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiConflictResponse, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProgramService } from './program.service';
import { CreateProgramDto } from './dto/create-program.dto';
import { Program } from './entities/program.entity';
import { Auth } from '../user/decorators/auth.decorator';
import { GetUser } from '../user/decorators/get-user.decorator';
import { ValidRoles } from '../user/enums/valid-roles.enum';
import { User } from '../user/entities/user.entity';

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

  // TODO Reto 2: GET    /api/program/:id           -> programa con sus estudiantes
  // TODO Reto 2: PATCH  /api/program/:id/students  -> agregar estudiantes (acumulativo)
  // TODO Reto 3: POST   /api/program/bulk          -> crear programas en lote (todo o nada)
  // TODO Reto 4: proteger los POST y el PATCH para que solo un admin pueda usarlos
}
