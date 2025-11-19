﻿﻿﻿﻿﻿import { Module } from "@nestjs/common";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./modules/auth/auth.module";
import { UserModule } from "./modules/user/user.module";
import { ProductModule } from "./modules/product/product.module";
import { OrderModule } from "./modules/order/order.module";
import { AppController } from "./app.controller";

@Module({
  imports: [PrismaModule, AuthModule, UserModule, ProductModule, OrderModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}