// TODO Reto 1: reglas de validación con class-validator
//   - name: string, mínimo 3 caracteres
//   - code: string de 3 a 6 letras MAYÚSCULAS (ej. "SIS", "MED")
//   - credits: entero positivo
import { IsInt, IsOptional, IsString, Max, Min, MinLength } from "class-validator";


export class CreateProgramDto {

    @IsString()
    @MinLength(3)
    name: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsInt()
    @Min(2)
    @Max(50)
    maxMembers: number;
}
