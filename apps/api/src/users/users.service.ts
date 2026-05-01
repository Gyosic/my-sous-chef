import { Inject, Injectable } from "@nestjs/common";
import * as schema from "@repo/db/schema";
import { DRIZZLE } from "@/database/database.module";
import { eq } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";

// const { id, name, email, image } = getTableColumns(schema.users);

@Injectable()
export class UsersService {
  constructor(@Inject(DRIZZLE) private db: NodePgDatabase<typeof schema>) {}

  async findAll() {
    const users = await this.db.select().from(schema.users);
    return { users };
  }

  async findOne(id: string) {
    const [user] = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, id));
    return { user };
  }

  async findOneByEmail(email: string) {
    const [user] = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, email));
    return { user };
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
