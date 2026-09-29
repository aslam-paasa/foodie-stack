```js
/**
 * Multi-Tenancy:
 * - One application (and one database) serves MANY separate customers.
 * - Each customer is called a "tenant".
 * - Example: Slack. 
 *   - Company A and Company B both use the same Slack app,
 *   - But neither can see the other's data. 
 *     - Company A = tenant 1,
 *     - Company B = tenant 2.
 * 
 * HOW DO WE KEEP TENANTS SEPARATE?
 * - Every user belongs to exactly ONE tenant (via tenantId).
 * - When we fetch data, we always filter by the tenant, so people only
 *   see what belongs to their own company.
 * 
 *                                                      Keeps users logged in
 *                                                   +-------------------------+
 *                                             +---->| refreshTokens           |
 *                                             |     +-------------------------+
 *      The people who log in                  |     | - id        : string pk |
 *   +-------------------------+               |     | - userId    : number fk |
 *   | Users                   |               |     | - expiresAt : timestamp |
 *   +-------------------------+               |     +-------------------------+
 *   | - id        : string pk |---------------+     ONE user has MANY refresh tokens
 *   | - email     : string    |                     (refreshTokens.userId  --->  users.id)
 *   | - firstName : string    |
 *   | - lastName  : string    |
 *   | - password  : string    |
 *   | - role      : string    |
 *   | - tenantId  : number fk |---------------+
 *   +-------------------------+               |
 *                                             |
 *                                             |
 *                                             |    The companies / organizations
 *                                             |      +-----------------------+
 *                                             +----->| tenants               |
 *                                                    +-----------------------+
 *                                                    | - id      : string pk |
 *                                                    | - name    : string    |
 *                                                    | - address : string    |
 *                                                    +-----------------------+
 *                                                    ONE tenant has MANY users
 *                                                (users.tenantId  --->  tenants.id)
 * 
 *
 * Note:
 * 1. PK (Primary Key): 
 *    - A column that uniquely identifies each row.
 *    - No two rows in a table can share the same PK.
 * 2. FK (Foreign Key): 
 *    - A column that stores the PK of a row in ANOTHER table. 
 *    - It's how tables are linked together.
 *    - Rule: An FK must have the same type as the PK it points
 *      to (string -> string).
 *
 *
 * TABLE-BY-TABLE EXPLANATION
 * 1. tenants  (the customer / organization)
 *    - id      : Unique ID of the tenant.
 *    - name    : Name of the company, e.g. "Acme Corp".
 *    - address : Where the company is located.
 *
 * 2. users  (people who log into the app)
 *    - id        : Unique ID of the user.
 *    - email     : Used to log in. Should be UNIQUE.
 *    - firstName : User's first name.
 *    - lastName  : User's last name.
 *    - password  : NEVER save plain text. Store a hash
 *                  (e.g. with bcrypt or argon2).
 *    - role      : What the user is allowed to do,
 *                  e.g. "admin", "manager", "customer".
 *    - tenantId  : FK -> tenants.id. Says which company this
 *                  user belongs to. This is the column that keeps
 *                  each tenant's data separate.
 *
 * 3. refreshTokens  (used for staying logged in)
 *    - id        : Unique ID of the token.
 *    - userId    : FK -> users.id. Says which user owns this token.
 *    - expiresAt : Date/time when the token stops working.
 *
 * Why refresh tokens? 
 * - An access token (the short-lived "key") expires quickly, 
 *   e.g. after 15 minutes, for safety. 
 * - A refresh token lasts longer (days or weeks) and lets the app 
 *   quietly get a new access token, so the user doesn't have to 
 *   log in again and again.
 *
 *
 * RELATIONSHIPS (in plain English)
 * - tenants  1 ----- *  users           One tenant has many users.
 * - users    1 ----- *  refreshTokens   One user has many tokens
 *                                       (e.g. phone, laptop, tablet).
 *
 *
 * REAL-WORLD EXAMPLE:
 * - tenants:        { id: "t1", name: "Acme Corp" }
 *                   { id: "t2", name: "Globex"    }
 *
 * - users:          { id: "u1", email: "amy@acme.com",   tenantId: "t1" }
 *                   { id: "u2", email: "bob@globex.com", tenantId: "t2" }
 *
 * - refreshTokens:  { id: "r1", userId: "u1", expiresAt: "2026-10-30" }
 *
 * Note:  
 * - Amy (u1) belongs to Acme (t1), so she can only see Acme's data.
 * - Bob (u2) belongs to Globex (t2), so he can't see Acme's data.
 *
 *
 * GOLDEN RULE
 * - ALWAYS filter queries by tenantId. Forgetting this can leak one
 *   company's data to another, which is a serious security bug.
 * - Example:  SELECT * FROM users WHERE tenantId = 't1';
 */

/**
 * ENTITY NAME CHANGE + MIGRATION
 * - Hum TypeORM entity ke database table name ko change kar rahe hain.
 * - Example:
 * 
 *   a. Pehle:
 *      TypeORM default convention ke according table ka naam "user" ya 
 *      configured naming strategy ke according ho sakta hai.
 *      
 *      @Entity()
 *      export class User {}
 *
 *   b. Ab hum explicitly table name define karenge:
 *
 *      @Entity({ name: 'users' })
 *      export class User {}
 *
 *
 * 1. ENTITY NAME KYA HAI?
 *    - @Entity() TypeORM ko batata hai ki ye class database table ko represent 
 *      karti hai.
 *    - Example:
 *
 *      @Entity({ name: 'users' })
 *      export class User {
 *        ...
 *      }
 *
 *    - Yahan:
 *          User
 *           |
 *           v
 *       users table
 *
 *    Important:
 *    - Class ka naam: User
 *    - Database table ka naam: users
 *    - Dono same hona zaroori nahi hai.
 *
 *
 * 2. EXPLICIT TABLE NAME
 *    - Hum database table ka exact naam specify kar sakte hain:
 *      @Entity({ name: 'users' })
 *
 *    - Example:
 *      @Entity({ name: 'refreshTokens' })
 *      export class RefreshToken {
 *        ...
 *      }
 *
 *    - Iska matlab TypeORM:
 *       RefreshToken class
 *             |
 *             v
 *       refreshTokens table
 *
 *    - Similarly:
 *        User class
 *            |
 *            v
 *        users table
 *
 *
 * 3. REFRESHTOKEN ENTITY
 *
 *    import {
 *      Entity,
 *      PrimaryGeneratedColumn,
 *      Column,
 *      ManyToOne,
 *      UpdateDateColumn,
 *      CreateDateColumn,
 *    } from 'typeorm';
 *    import { User } from './User';
 *   
 *    @Entity({ name: 'refreshTokens' })
 *    export class RefreshToken {
 *   
 *      @PrimaryGeneratedColumn()
 *      id: number;
 *   
 *      @Column({ type: 'timestamp' })
 *      expiresAt: Date;
 *   
 *      @ManyToOne(() => User)
 *      user: User;
 *   
 *      @UpdateDateColumn()
 *      updatedAt: Date;
 *   
 *      @CreateDateColumn()
 *      createdAt: Date;
 *    }
 *
 *    Important:
 *    - @ManyToOne(() => User)
 *    - means: Many RefreshTokens
 *                 |
 *                 v
 *              One User
 *
 *    Example:
 *     User
 *      |
 *      +---- RefreshToken 1
 *      |
 *      +---- RefreshToken 2
 *      |
 *      +---- RefreshToken 3
 *
 * 4. USER ENTITY
 *
 *     @Entity({ name: 'users' })
 *     export class User {
 *    
 *       @PrimaryGeneratedColumn()
 *       id: number;
 *    
 *       @Column({ type: 'varchar' })
 *       firstName: string;
 *    
 *       @Column({ type: 'varchar' })
 *       lastName: string;
 *    
 *       @Column({ type: 'varchar', unique: true })
 *       email: string;
 *    
 *       @Column({ type: 'varchar' })
 *       password: string;
 *    
 *       @Column({ type: 'varchar' })
 *       role: string;
 *     }
 *
 *    Important:
 *    @Column({ unique: true })
 *    email: string;
 *    means: Do users ke email same nahi ho sakte.
 *
 *
 * 5. WHY DO WE CHANGE ENTITY NAME?
 *    - Database mein table naming ko explicit aur consistent rakhne ke liye.
 *    - Example:
 *      - Class: User
 *      - Table: users
 *
 *      - Class: RefreshToken
 *      - Table: refreshTokens
 *
 *    - Isse application code aur database naming clearly separated rehti hai.
 *
 *
 * 6. ENTITY CHANGE KE BAAD KYA KARNA HAI?
 *    - Sirf entity file change karne se database automatically update nahi hota,
 *      especially jab synchronize: false use kar rahe ho.
 *    - Hume migration generate karni hoti hai.
 *
 *    - Flow:
 *       Entity change
 *            |
 *            v
 *       Generate migration
 *            |
 *            v
 *       Review migration
 *            |
 *            v
 *       Run migration
 *            |
 *            v
 *       Database updated
 *
 * 
 * 7. GENERATE MIGRATION
 *    - Command: npm run migration:generate -- src/migration/rename_tables
 *    - Is command ka meaning:
 *      - migration:generate - Current entities aur database schema ko compare karo.
 *      - src/migration/rename_tables - Generated migration file ko is location/name
 *        ke according create karo.
 *
 *    - Example generated file:
 *      - src/migration/1730000000000-rename_tables.ts
 *
 *
 * 8. MIGRATION ACTUALLY KYA KARTI HAI?
 *    - Migration database schema mein changes ko record karti hai.
 *    - Example:
 *      a.  Entity change:
 *          @Entity({ name: 'users' })
 *
 *      b. Database mein required change:
 *
 *          old_table
 *               |
 *               v
 *             users
 *
 *    - TypeORM migration generate karke SQL changes create karne ki koshish karega.
 *    - Migration mein generally do methods hoti hain:
 *      a. up()   - Change apply karta hai.
 *      b. down() - Change reverse karta hai.
 *
 *
 * 9. GENERATE VS RUN
 *    Ye interview mein important difference hai.
 *    a. migration:generate
 *       - Entities aur current database schema ko compare karke  migration file
 *         generate karta hai.
 *
 *    b. migration:run
 *       - Already generated migration ko actual database par execute karta hai.
 *
 *    Flow:
 *     Entity change
 *          |
 *          v
 *     migration:generate
 *          |
 *          v
 *     Migration file
 *          |
 *          v
 *     migration:run
 *          |
 *          v
 *     Database updated
 *
 *
 * 10. IMPORTANT: MIGRATION KO REVIEW KARNA
 *     - Migration generate hone ke baad blindly run nahi karna.
 *     - Pehle generated migration file check karo.
 *     - Especially table rename jaise changes mein verify karo ki TypeORM: RENAME TABLE
 *       kar raha hai ya:
 *       - DROP TABLE
 *       - CREATE TABLE, kar raha hai.
 *     - Agar data important hai, DROP + CREATE dangerous ho sakta hai kyunki existing
 *       data lose ho sakta hai.
 *
 *
 * 11. RUN MIGRATION
 *     - Migration generate hone ke baad: npm run migration:run
 *     - Ye generated migration ko database par apply karega.
 *
 * 
 * 12. INTERVIEW QUESTIONS
 *     Q1. What does @Entity({ name: 'users' }) do?
 *     A:  Ye TypeORM ko batata hai ki User entity ko database ke "users" table se
 *         map karna hai.
 *
 *
 *     Q2. Is entity class name and database table name required to be same?
 *     A: Nahi.
 *
 *        class User
 *             |
 *             v
 *        users table
 *
 *       Entity class aur database table ka naam different ho sakta hai.
 *
 *
 *     Q3. Does changing an entity automatically change the database?
 *     A: Generally nahi, especially production applications mein jahan synchronize
 *        disabled hota hai. Database schema changes ke liye migrations use karte hain.
 *
 *
 *     Q4. What does migration:generate do?
 *     A: Ye entity definitions aur current database schema ke difference ko detect
 *        karke migration file generate karta hai.
 *
 *
 *     Q5. What does migration:run do?
 *     A: Ye generated pending migrations ko actual database par execute karta hai.
 *
 *
 *     Q6. What is the difference between migration:generate and migration:run?
 *     A: migration:generate -> Migration file create karta hai.
 *        migration:run      -> Migration file ko database par execute karta hai.
 *
 *
 *     Q7. Why should we review generated migrations?
 *     A: ORM kabhi-kabhi schema change ko unexpected way mein generate kar sakta hai.
 *        Example:
 *        - Expected: RENAME TABLE
 *        - But generated:
 *          - DROP TABLE
 *          - CREATE TABLE
 *        - DROP + CREATE se existing data lose ho sakta hai.
 *
 *
 *     Q8. What is the purpose of up() and down()?
 *     A: up()   -> Migration apply karta hai.
 *        down() -> Migration ko reverse karta hai.
*/

/**
 * QUICK REVISION
 * 1. @Entity()                  -> Class ko database entity/table se map karta hai.
 * 2. @Entity({ name: 'users' }) -> Exact database table name define karta hai.
 * 3. migration:generate         -> Migration file generate karta hai.
 * 4. migration:run              -> Migration database par apply karta hai.
 * 5. up()                       -> Change apply.
 * 6. down()                     -> Change reverse.
 * 7. Migration review           -> Data loss aur unexpected schema changes avoid karne
 *                                  ke liye important.
*/

/**
 * ONE-LINE INTERVIEW ANSWER
 * - "In TypeORM, we can explicitly map an entity to a database table using 
 *   @Entity({ name: 'users' }). 
 * - After changing the entity schema, we generate a migration to capture the
 *   schema difference and then run the migration to apply the change to the database."
 */
```

```js
/**
 * DEVELOPING TENANT ENTITY + USER-TENANT RELATIONSHIP
 * 
 * Goal:
 *  - Hum apne Auth Service mein multi-tenancy implement karenge.
 *  - Ab tak:
 *
 *      User
 *       |
 *       v
 *    User data
 *
 *  - Ab:
 *    Tenant
 *      |
 *      +---- User
 *      +---- User
 *      +---- User
 *
 *
 *  - Example:
 *     Tenant: Restaurant A
 *         |
 *         +---- admin@restaurantA.com
 *         +---- manager@restaurantA.com
 *         +---- staff@restaurantA.com
 *    
 *     Tenant: Restaurant B
 *         |
 *         +---- admin@restaurantB.com
 *         +---- manager@restaurantB.com
 *
 *
 * 1. CREATE TENANT ENTITY
 *    - File: src/entity/Tenant.ts
 *
 *
 *      import {
 *        Entity,
 *        PrimaryGeneratedColumn,
 *        Column,
 *        UpdateDateColumn,
 *        CreateDateColumn,
 *      } from 'typeorm';
 *     
 *     
 *      @Entity({ name: 'tenants' })
 *      export class Tenant {
 *     
 *        @PrimaryGeneratedColumn()
 *        id: number;
 *     
 *        @Column('varchar', { length: 100 })
 *        name: string;
 *     
 *        @Column('varchar', { length: 255 })
 *        address: string;
 *     
 *        @UpdateDateColumn()
 *        updatedAt: Date;
 *     
 *        @CreateDateColumn()
 *        createdAt: Date;
 *      }
 *
 *
 * 2. UNDERSTANDING TENANT ENTITY
 *    - @Entity({ name: 'tenants' })
 *    - Iska matlab:
 *       Tenant class
 *            |
 *            v
 *       tenants database table
 *
 *    a. id
 *       @PrimaryGeneratedColumn()
 *       id: number;
 *       - Ye tenant ka unique ID hai.
 *       - Example:
 *         - Tenant A -> id = 1
 *         - Tenant B -> id = 2
 *         - Tenant C -> id = 3
 *
 *    b. name
 *       @Column('varchar', { length: 100 })
 *       name: string;
 *       - Tenant/company/organization ka naam store karega.
 *       - Example:
 *         - Foodie Restaurant
 *         - ABC Restaurant
 *         - XYZ Corporation
 *      - Maximum length: 100 characters
 *
 *    c. address
 *       @Column('varchar', { length: 255 })
 *       address: string;
 *       - Tenant ka address store karega.
 *       - Maximum length: 255 characters
 *
 *    d. createdAt
 *       @CreateDateColumn()
 *       createdAt: Date;
 *       - Record create hone ka time automatically store hota hai.
 *
 *    e. updatedAt
 *       @UpdateDateColumn()
 *       updatedAt: Date;
 *       - Record last time kab update hua, wo automatically maintain hota hai.
 *
 *
 * 3. IMPORTANT: DATE COLUMN TYPE
 *    @CreateDateColumn()
 *    @UpdateDateColumn()
 *    - ke saath application property ko generally Date rakhna better hai.
 *    - Correct:
 *      - createdAt: Date;
 *      - updatedAt: Date;
 *    - Number rakhne ki zaroorat nahi hai unless tum specifically timestamp ko 
 *      numeric value ke form mein manage kar rahe ho.
 *
 *
 * 4. GENERATE TENANT TABLE MIGRATION
 *    - Entity create/change karne ke baad database automatically update nahi karna
 *      chahiye.
 *    - Migration generate karo:
 *      npm run migration:generate -- src/migration/create_tenants_table
 *    - TypeORM:
 *    
 *        Entity
 *           |
 *           v
 *        Database schema compare
 *           |
 *           v
 *        Migration file
 *
 *    - Example:
 *       src/migration/
 *         |
 *         +-- 123456789-create_tenants_table.ts
 *
 *
 * 5. RUN TENANT MIGRATION
 *    - Migration generate hone ke baad: npm run migration:run
 *    - Isse database mein: tenants table create ho jayega.
 *    - Final table roughly:
 *
 *      tenants
 *      +----+------+---------+-----------+-----------+
 *      | id | name | address | createdAt | updatedAt |
 *      +----+------+---------+-----------+-----------+
 *
 *
 * 6. NOW LINK USERS WITH TENANTS
 *    - Abhi User aur Tenant separate entities hain.
 *    - Hume relationship create karni hai:
 *
 *       tenants
 *           |
 *           | 1
 *           |
 *           | MANY
 *           v
 *         users
 *
 *    - Meaning:
 *       One Tenant
 *           |
 *           +---- Many Users
 *
 *
 * 7. ADD @ManyToOne TO USER
 *    - User entity mein:
 *
 *       import {
 *         Entity,
 *         PrimaryGeneratedColumn,
 *         Column,
 *         ManyToOne,
 *       } from 'typeorm';
 *       
 *       import { Tenant } from './Tenant';
 *       
 *       
 *       @Entity({ name: 'users' })
 *       export class User {
 *       
 *         @PrimaryGeneratedColumn()
 *         id: number;
 *       
 *         @Column({ type: 'varchar' })
 *         firstName: string;
 *       
 *         @Column({ type: 'varchar' })
 *         lastName: string;
 *       
 *         @Column({
 *           type: 'varchar',
 *           unique: true,
 *         })
 *         email: string;
 *       
 *         @Column({ type: 'varchar' })
 *         password: string;
 *       
 *         @Column({ type: 'varchar' })
 *         role: string;
 *       
 *         @ManyToOne(() => Tenant)
 *         tenant: Tenant;
 *       }
 *
 *
 * 8. WHAT DOES @ManyToOne MEAN?
 *    - @ManyToOne(() => Tenant) ka meaning:
 *
 *       Many Users
 *           |
 *           v
 *       One Tenant
 *
 *   - Example:
 *
 *     Tenant 1
 *        |
 *        +---- User 1
 *        +---- User 2
 *        +---- User 3
 *
 *     Tenant 2
 *        |
 *        +---- User 4
 *        +---- User 5
 *
 *   - Therefore:
 *     - Tenant -> Users  = One-to-Many
 *     - User   -> Tenant = Many-to-One
 *
 *
 * 9. HOW DOES TYPEORM CREATE tenantId?
 *    - Jab hum likhte hain:
 *      @ManyToOne(() => Tenant)
 *      tenant: Tenant;
 *
 *    - TypeORM relationship ke liye database mein generally foreign-key column 
 *      create karega.
 *    - Conceptually:
 *
 *      users
 *      +----+---------+----------+
 *      | id | email   | tenantId |
 *      +----+---------+----------+
 *
 *      - tenantId reference karega: tenants.id
 *      - Relationship: users.tenantId
 *                           |
 *                           v
 *                       tenants.id
 *
 *
 * 10. FOREIGN KEY KYA HAI?
 *     - Foreign key database mein do tables ke beech relationship establish karti hai.
 *     - Example:
 *
 *       users.tenantId
 *            |
 *            v
 *        tenants.id
 *
 *     - Iska meaning: User ka tenantId kisi existing tenant ke id ko reference karega.
 *
 *     - Example: 
 *       a. tenants
 *          - id = 1
 *          - name = "Restaurant A"
 *
 *       b. users
 *          - id = 101
 *          - email = "admin@a.com"
 *          - tenantId = 1
 *
 *       c. Matlab: User 101 belongs to Tenant 1.
 *
 *
 * 11. WHY FOREIGN KEY?
 *     - Foreign key database level par relationship ko enforce karne mein help 
 *       karti hai.
 *     - Example: Agar tenantId = 999 hai aur tenants table mein id = 999 exist nahi
 *       karta, to foreign-key constraint invalid reference ko prevent kar sakti hai.
 *       Isse database integrity maintain hoti hai.
 *
 *
 * 12. GENERATE FOREIGN KEY MIGRATION
 *     - User entity mein @ManyToOne add karne ke baad:
 *       npm run migration:generate -- src/migration/add_tenantId_foreign_key
 *     - TypeORM difference detect karega:
 *       a. OLD:
 *
 *          users
 *          +----+---------+
 *          | id | email   |
 *          +----+---------+
 *
 *       b. NEW:
 *
 *          users
 *          +----+---------+----------+
 *          | id | email   | tenantId |
 *          +----+---------+----------+
 *
 *      - Aur required migration generate karega.
 *
 *
 * 13. RUN FOREIGN KEY MIGRATION
 *     - Migration generate hone ke baad: npm run migration:run
 *     - Ab database mein relationship create ho jayega.
 *     - Final relationship:
 *       +-----------------------+
 *       | tenants               |
 *       +-----------------------+
 *       | id        PK          |
 *       | name                  |
 *       | address               |
 *       | createdAt             |
 *       | updatedAt             |
 *       +-----------+-----------+
 *                   |
 *                   | 1
 *                   |
 *                   | MANY
 *                   v
 *       +-----------------------+
 *       | users                 |
 *       +-----------------------+
 *       | id        PK          |
 *       | firstName             |
 *       | lastName              |
 *       | email                 |
 *       | password              |
 *       | role                  |
 *       | tenantId  FK          |
 *       +-----------------------+
 *
 *
 * 14. COMPLETE FLOW
 * STEP 1: Create Tenant entity
 *                  |
 *                  v
 * STEP 2: Generate migration
 *         - npm run migration:generate -- src/migration/create_tenants_table
 *                  |
 *                  v
 * STEP 3: Run migration
 *         - npm run migration:run
 *                  |
 *                  v
 *         - tenants table created
 *                  |
 *                  v
 * STEP 4: Add relationship in User:
 *         @ManyToOne(() => Tenant)
 *         tenant: Tenant;
 *                  |
 *                  v
 * STEP 5: Generate migration:
 *         - npm run migration:generate -- src/migration/add_tenantId_foreign_key
 *                  |
 *                  v
 * STEP 6: Run migration:
 *         - npm run migration:run
 *                  |
 *                  v
 *         - users.tenantId
 *                  |
 *                  v
 *         - tenants.id
 *
 *
 * 15. INTERVIEW QUESTIONS
 *
 *     Q1. What is a Tenant?
 *     A: Tenant generally ek customer, company ya organization
 *        ko represent karta hai jo SaaS application use karti hai.
 *    
 *     Q2. Why do we need a Tenant entity?
 *     A: Multiple organizations ko same application mein logically
 *        separate karne ke liye tenant concept use karte hain.
 *    
 *     Q3. What is the relationship between User and Tenant?
 *     A:  One Tenant can have many Users.
 *         Therefore:
 *         - Tenant -> User
 *         - One-to-Many
 *    
 *         User side se:
 *         - User -> Tenant
 *         - Many-to-One
 *    
 *     Q4. What does @ManyToOne(() => Tenant) mean?
 *     A: Iska meaning hai ki multiple User records ek Tenant se belong kar sakte hain.
 *    
 *     Q5. Where is tenantId stored?
 *     A: User-Tenant relationship ke liye users table mein generally tenantId
 *        foreign-key column create hota hai.
 *    
 *         users.tenantId
 *               |
 *               v
 *         tenants.id
 *    
 *    
 *     Q6. What is a foreign key?
 *     A: Foreign key ek table ke column ko doosri table ke primary key se link karti
 *        hai aur relationship/data integrity maintain karne mein help karti hai.
 *    
 *     Q7. Why do we use migrations?
 *     A: Database schema changes ko controlled, versioned aur repeatable way mein 
 *        apply karne ke liye migrations use karte hain.
 *    
 *     Q8. Why do we generate migration after changing an entity?
 *     A: Entity aur current database schema ke difference ko database changes mein
 *        convert karne ke liye migration generate karte hain.
 *    
 *     Q9. What is the difference between migration:generate and migration:run?
 *     A:  migration:generate : Migration file generate karta hai.
 *         migration:run      : Pending migration ko database par execute karta hai.
 *    
 *     Q10. How would you explain this relationship in an interview?
 *     A: - "We have a Tenant entity representing an organization.
 *        - A tenant can have multiple users, so the User entity has a ManyToOne
 *          relationship with Tenant. 
 *        - TypeORM creates a tenantId foreign key in the users table referencing the
 *          tenants table's primary key."
 *
 *
 * QUICK REVISION
 * 1. Tenant                   : Organization/customer
 * 2. tenants.id               : Tenant primary key
 * 3. User                     : Application user
 * 4. @ManyToOne(() => Tenant) :  Many users belong to one tenant
 * 5. tenantId                 : User ke tenant ko identify karta hai
 * 6. Foreign Key              : users.tenantId -> tenants.id
 * 7. migration:generate       : Migration file create
 * 8. migration:run            : Migration database par execute
 *
 *
 * ONE-LINE INTERVIEW ANSWER
 * - "We introduced a Tenant entity for multi-tenancy and linked Users to Tenants 
 *    using a ManyToOne relationship, where the users table contains a tenantId
 *   foreign key referencing tenants.id."
 */
```