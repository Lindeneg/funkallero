interface IGetBookResponse {
    id: string;
    name: string;
    description: string;
    author: Record<'id' | 'name', string>;
}

export default IGetBookResponse;
