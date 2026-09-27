import { QuestionService } from "../services/question.service.js";
import { BlueprintEngine } from "../engine/blueprint.engine.js";

const service = new QuestionService();
const command = process.argv[2];

switch (command) {

    case "validate": {
        const results = service.validateAll();

        let invalid = 0;

        for (const result of results) {
            if (!result.result.valid) {
                invalid++;

                console.log(
                    `\n❌ ${result.questionId}`
                );

                for (const error of result.result.errors) {
                    console.log(
                        `   [${error.code}] ${error.message}`
                    );
                }
            }
        }

        console.log(
            `\nTotal: ${results.length}`
        );

        console.log(
            `Invalid: ${invalid}`
        );

        process.exit(
            invalid > 0 ? 1 : 0
        );
    }

    case "stats": {
        console.log(
            JSON.stringify(
                service.statistics(),
                null,
                2
            )
        );

        break;
    }

    case "blueprint": {
        const questions = service.getAll();

        const engine = new BlueprintEngine();

        const result = engine.build(
            questions,
            {
                phase: "B",
                subject: "Al-Qur'an Hadis",
                count: 10,

                cognitive: {
                    C1: 2,
                    C2: 3,
                    C3: 3,
                    C4: 2
                }
            }
        );

        console.log(
            JSON.stringify(
                result,
                null,
                2
            )
        );

        break;
    }

    default: {
        console.log(`
QBank KBC × 21CLD

Commands:

  npm run validate
  npm run stats
  npm run blueprint
    `);
    }
}
