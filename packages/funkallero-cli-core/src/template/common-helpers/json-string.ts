import handlebars from 'handlebars';

const jsonString = (text: Record<string, any>) => {
    return new handlebars.SafeString(
        JSON.stringify(
            text,
            (_, value) => {
                if (value instanceof handlebars.SafeString) return value.toString();
                return value;
            },
            4
        )
    );
};

export default jsonString;
