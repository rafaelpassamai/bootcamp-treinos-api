import { IUserRepository } from "../interfaces/user-repository-interface.js";
import { User } from "../../models/user.model.js";

export class InMemoryUserRepository implements IUserRepository {
  public items: User[] = [];

  async findById(id: string): Promise<User | null> {
    return this.items.find((user) => user.id === id) ?? null;
  }

  async save(user: User): Promise<void> {
    const index = this.items.findIndex((u) => u.id === user.id);
    if (index >= 0) {
      this.items[index] = user;
    }
  }
}
