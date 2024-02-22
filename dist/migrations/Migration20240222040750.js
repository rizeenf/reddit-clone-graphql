"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20240222040750 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20240222040750 extends migrations_1.Migration {
    async up() {
        this.addSql('create table "post" ("id" serial primary key, "title" text not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);');
    }
}
exports.Migration20240222040750 = Migration20240222040750;
//# sourceMappingURL=Migration20240222040750.js.map