import { User } from "../models/User";
import { IMailProvider } from "../providers/IMailProvider";
import { IUsersRepository } from "../repositories/IUsersRepository";
import { ICreateUserRequestDTO } from "./CreateUserDTO";

export class CreateUserUseCase {

  constructor(
    private usersRepository: IUsersRepository,
    private mailProvider: IMailProvider,
  ) {}

  async execute(data: ICreateUserRequestDTO) {
    const jaExiste = await this.usersRepository.findByEmail(data.email);

    if (jaExiste) {
      throw  new Error('User already exists.');
    }

    const user = new User(data);

    await this.usersRepository.save(user);

    this.mailProvider.sendMail({
      to: {
        name: data.name,
        email: data.email,
      },
      from: {
        name: 'Equipe Luizdev',
        email: 'luiiz.silverio@gmail.com'
      },
      subject: 'Seja bem-vindo à plataforma',
      body: '<p>Você já pode fazer login em nossa plataforma'
    })
  }
}
