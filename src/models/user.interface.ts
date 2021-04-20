interface User {
    username: string;
    email: string;
    password: string;
    hasRequiredAge: boolean;
    tokenVersion: number;
    active: boolean;
    confirmationCode: string;
}

export default User;