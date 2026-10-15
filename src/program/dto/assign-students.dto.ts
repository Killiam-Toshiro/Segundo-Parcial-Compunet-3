// TODO Reto 2: reglas de validación con class-validator
//   - studentIds: arreglo NO vacío, cada elemento debe ser un UUID
import { ApiProperty } from "@nestjs/swagger";
import { ArrayNotEmpty, IsArray, IsUUID } from "class-validator";

export class AssignStudentsDto {
	@ApiProperty({
		example: ["4fcfc5ab-7902-478f-b173-b8f1e751af12"],
		description: "Student IDs to add to the program"
	})
	@IsArray()
	@ArrayNotEmpty()
	@IsUUID("4", { each: true })
	studentIds!: string[];
}
