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
    created_at: Date;
}

export default User;