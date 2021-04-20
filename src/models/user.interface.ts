interface User {
    username: string;
    email: string;
    password: string;
    tokenVersion: number;
    active: boolean;
    confirmationCode: string;
}

export default User;