interface IGetAuthorResponse {
    id: string;
    name: string;
    books: Record<'id' | 'name' | 'description', string>[];
}

export default IGetAuthorResponse;
