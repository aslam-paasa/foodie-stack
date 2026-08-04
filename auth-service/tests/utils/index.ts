import { DataSource } from "typeorm";

export const truncateTable = async (connection: DataSource, tableName: string) => {
    const entities = connection.entityMetadatas;
    for (const entity of entities) {
        const repository = connection.getRepository(entity.name);
        await repository.clear();
    }
}