interface User {
    username: string;
    email: string;
    password: string;
    hasRequiredAge: boolean;
    tokenVersion: boolean;
}

export default User;