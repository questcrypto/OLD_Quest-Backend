import { configService } from '../Services/config.service';
import fs = require('fs');
fs.writeFileSync('ormconfig.json',
 JSON.stringify(configService.getTypeORMConfig(), null, 2)
);