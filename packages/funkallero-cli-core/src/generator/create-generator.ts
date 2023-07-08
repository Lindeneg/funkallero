import type { ScaffoldGenerator, AnyScaffoldAnswers } from './types';
import type { SpecificPartial } from '../module/types';

type CreateGeneratorOpts<TAnswers extends AnyScaffoldAnswers> = SpecificPartial<
    ScaffoldGenerator<TAnswers>,
    'setAnswersFromArgumentVector'
>;

const createGenerator = <TAnswers extends AnyScaffoldAnswers>(
    implementation: CreateGeneratorOpts<TAnswers>
): ScaffoldGenerator<TAnswers> => ({
    setAnswersFromArgumentVector() {
        return Promise.resolve();
    },

    ...implementation,
});

export default createGenerator;
