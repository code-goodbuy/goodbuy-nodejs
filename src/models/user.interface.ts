interface User {
    username: string;
    email: string;
    password: string;
    hasRequiredAge: boolean;
    tokenVersion: number;
}

export default User;