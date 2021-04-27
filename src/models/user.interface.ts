interface User {
    username: string;
    email: string;
    password: string;
    hasRequiredAge: boolean;
    tokenVersion: number;
    active: boolean;
    confirmationCode: string;
    description: string;
    imageURL: string;
}

export default User;