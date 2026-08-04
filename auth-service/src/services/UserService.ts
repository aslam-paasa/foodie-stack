import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import { User } from "../entity/User";
import { UserData } from "../types";
import { Repository } from "typeorm";
import { Roles } from "../constants/index";

export class UserService {
    constructor(private userRepository: Repository<User>) { }

    async create({ firstName, lastName, email, password }: UserData) {
        
        /* Hash the password */
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        try {
            return await this.userRepository.save({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                role: Roles.CUSTOMER
            })
        } catch (err) {
            const error = createHttpError(500, "Failed to store data in the database")
            throw error;
        }
    }
}