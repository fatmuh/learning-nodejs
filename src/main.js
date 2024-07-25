import {web} from "./application/web.js";
import {logger} from "./application/logging.js";

web.listen(300, () => {
    logger.info("Listening on http://localhost:3000");
})