"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/* eslint-disable */
// @ts-nocheck
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        // How to use?
        // - Launch VS Code extension 
        // - Open this file
        // - Check visually that highligting works
        const db;
        const raw;
        const sql;
        const join;
        const empty;
        // $queryRaw to return actual records (for example, using SELECT)
        // $executeRaw to return a count of affected rows (for example, after an UPDATE or DELETE)
        // $queryRawUnsafe to return actual records (for example, using SELECT) using a raw string. Potential SQL injection risk
        // $executeRawUnsafe to return a count of affected rows (for example, after an UPDATE or DELETE) using a raw string. Potential SQL injection risk
        /*
        * Working
        */
        // Test queryRaw`string`
        const result = yield prisma.$queryRaw `select * FROM User`;
        // Test queryRaw`string` multiline
        const result = yield prisma.$queryRaw `
      select * FROM User 
        WHERE firstname = 'Alice'
          AND somenumber = 1`;
        // Test queryRaw<type>`string`
        const result = yield prisma.$queryRaw `SELECT * FROM User`;
        // Test .$queryRaw`` with ${param}
        const queryRawTemplateWithParams = yield db.$queryRaw `SELECT * FROM User WHERE name = ${'Alice'} OR city = ${city}`;
        // Test .$executeRaw`` with ${param}
        const $executeRawTemplate = yield db.$executeRaw `UPDATE User SET name = ${'name'} WHERE id = ${id}`;
        /*
        * Not working
        */
        const result = yield prisma.$queryRaw(`SELECT * FROM User`);
        const result = yield prisma.$queryRaw('SELECT * FROM User');
        const result = yield prisma.$queryRaw("SELECT * FROM User");
        const result = yield prisma.$queryRaw(`SELECT * FROM User`);
        const result = yield prisma.$queryRaw('SELECT * FROM User');
        const result = yield prisma.$queryRaw("SELECT * FROM User");
        const test = /* sql */ `SELECT * FROM`;
        sql `SELECT * FROM User`;
        const test = `SELECT * FROM User`;
        // Test queryRaw(string)
        const queryRaw = yield db.$queryRawUnsafe('SELECT 1');
        // Test queryRaw(string, values)
        const queryRawWithValues = yield db.$queryRawUnsafe('SELECT $1 AS name, $2 AS id', 'Alice', 42);
        // Test queryRaw`` with prisma.sql``
        const queryRawTemplateFromSqlTemplate = yield db.$queryRaw(sql `
      SELECT ${join([raw('email'), raw('id'), raw('name')])}
      FROM ${raw('User')}
      ${sql `WHERE name = ${'Alice'}`}
      ${empty}
    `);
        // Test .$executeRaw(string)
        const executeRaw = yield db.$executeRawUnsafe('UPDATE User SET name = $1 WHERE id = $2', 'name', 'id');
        // Test .$executeRaw(string, values)
        const executeRawWithValues = yield db.$executeRawUnsafe('UPDATE User SET name = $1 WHERE id = $2', 'Alice', 'id');
    });
}
//# sourceMappingURL=manual-test-client-raw-sql-highlight.js.map