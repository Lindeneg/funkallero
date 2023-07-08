import logger from '../../logger';
import extendAction from '../extend-action';
import { stringifyJsonOrFallback, parseJsonOrNull } from '../../template/logic';

type ModifyRenderedJsonFilePayload = {
    path: string;
    transform: (obj: Record<string, any>) => Record<string, any>;
};

export default extendAction((payload: ModifyRenderedJsonFilePayload) => {
    return {
        type: 'modify',
        path: payload.path,
        transform(template) {
            const json = parseJsonOrNull(template);

            if (!json) {
                logger.error({
                    source: 'commonActions.modifyRenderedJsonFile',
                    msg: 'failed to parse template to json',
                    template,
                    path: payload.path,
                });

                return template;
            }

            return stringifyJsonOrFallback(template, payload.transform(json));
        },
    };
});
