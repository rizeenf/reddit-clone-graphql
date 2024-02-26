"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20240226134829 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20240226134829 extends migrations_1.Migration {
    async up() {
        this.addSql('create table "user" ("id" serial primary key, "username" text not null, "password" text not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);');
        this.addSql('alter table "user" add constraint "user_username_unique" unique ("username");');
        this.addSql('create table "post" ("id" serial primary key, "title" text not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);');
    }
}
exports.Migration20240226134829 = Migration20240226134829;
//# sourceMappingURL=Migration20240226134829.js.map