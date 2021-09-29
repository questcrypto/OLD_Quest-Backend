import {Global, Module } from '@nestjs/common';
import { ConfigService } from './../../Services/config.service';
const providers=[
    {
        provide:ConfigService,
        useValue:new ConfigService(`env/${process.env.NODE_ENV || 'development'}.env`),
    },
]
@Global()
@Module({
    providers,
    exports:[
        ...providers
    ]
})
export class ConfigModule {}
