```js
/**
 * GOAL
 * - Ye notes humare authentication system ka POORA flow explain karte hain.
 * - Content bada hai, isliye 4 parts mein divide kiya gaya hai:
 *     PART 1 -> Dependency Injection, wiring, routes, middleware   (Sections 1-11)
 *     PART 2 -> Login endpoint + token generation + cookies        (Sections 12-24)
 *     PART 3 -> Protected routes, JWT verification, /self, password(Sections 25-36)
 *     PART 4 -> PEM/JWT/JWK/JWKS, complete architecture, recap     (Sections 37-54)
 *
 * - Poori learning ORDER ye hai:
 *     1.  Dependency Injection kya hai?
 *     2.  Database connection banao
 *     3.  Database se Repository lo
 *     4.  Repository ko Services mein inject karo
 *     5.  Services ko Controller mein inject karo
 *     6.  Controller ko Routes se connect karo
 *     7.  Login flow samjho
 *     8.  Access + Refresh Tokens generate karo
 *     9.  Tokens ko Cookies mein store karo
 *    10.  JWT verification se Routes protect karo
 *    11.  JWT se User nikaalo
 *    12.  Response se Password hatao
 *    13.  PEM, JWT, JWK aur JWKS samjho
 *    14.  Complete Authentication Flow samjho
*/

/**
 * ────────────────────────────────────────────────────────────────
 * BIG PICTURE ARCHITECTURE (Part 1 ka nakshaa)
 * ────────────────────────────────────────────────────────────────
 *
 *   Ye app LAYERS mein bani hai. Har layer sirf apne NEECHE wali
 *   layer se baat karti hai:
 *
 *      ┌──────────────────────────────────────────────────┐
 *      │  ROUTES        (URL -> middleware -> controller) │
 *      ├──────────────────────────────────────────────────┤
 *      │  CONTROLLER    (HTTP request/response handle)    │
 *      ├──────────────────────────────────────────────────┤
 *      │  SERVICES      (business logic)                  │
 *      ├──────────────────────────────────────────────────┤
 *      │  REPOSITORY    (database operations)             │
 *      ├──────────────────────────────────────────────────┤
 *      │  DATASOURCE    (database connection/config)      │
 *      └──────────────────────────────────────────────────┘
 *                          |
 *                          v
 *                     PostgreSQL
 *
 *   Dependency Injection ka kaam hai in layers ko ek dusre se
 *   JODNA (wire karna) -- bina ek layer ko dusri layer banane
 *   ki zimmedari diye.
*/

/**
 * ────────────────────────────────────────────────────────────────
 * 1. DEPENDENCY INJECTION (DI)
 * ────────────────────────────────────────────────────────────────
 *
 * DEPENDENCY KYA HOTI HAI?
 * - Dependency = wo cheez jo ek class ko apna kaam karne ke liye chahiye.
 * - Example:
 *
 *     class UserService {
 *         constructor(
 *             private userRepository: Repository<User>
 *         ) {}
 *     }
 *
 * - Yaha:
 *     UserService
 *         |
 *         └── ko chahiye UserRepository
 *
 * - Isliye: UserRepository = UserService ki dependency
 *
 *
 * DI KE BINA (WITHOUT DEPENDENCY INJECTION)
 * - Class apni dependency KHUD banati hai:
 *
 *     class UserService {
 *         private repository =
 *             AppDataSource.getRepository(User);
 *     }
 *
 * - Ab UserService ko pata hai ki database aur repository KAISE bante hain.
 * - Dependency chain ban jaati hai:
 *
 *     UserService
 *          |
 *          ↓
 *     AppDataSource
 *          |
 *          ↓
 *     Database
 *
 * - Isse TIGHT COUPLING ho jaati hai.
 * - Class do kaam kar rahi hai:
 *     1. User se related business logic
 *     2. Database dependencies banana
 *
 *
 * DI KE SAATH (WITH DEPENDENCY INJECTION)
 * - Dependency ko class ke ANDAR banane ke bajaye, BAHAR banate hain
 *   aur class ko PASS kar dete hain:
 *
 *     class UserService {
 *         constructor(
 *             private userRepository: Repository<User>
 *         ) {}
 *     }
 *
 * - Phir kahin aur (bahar):
 *
 *     const userRepository = AppDataSource.getRepository(User);
 *     const userService = new UserService(userRepository);
 *
 * - Flow ban jaata hai:
 *
 *     Dependency banao
 *           |
 *           ↓
 *     userRepository
 *           |
 *           ↓
 *     UserService ko pass karo
 *           |
 *           ↓
 *     UserService use karta hai
 *
 * - Yehi hai Dependency Injection.
 *
 *
 * SIMPLE DEFINITION
 * - Dependency Injection ka matlab:
 *   "Class ko jo cheezein chahiye, wo usse BAHAR se milti hain,
 *    wo khud unhe nahi banati."
 *
 * - Yaad rakho:
 *     Dependency = Wo cheez jo class ko chahiye
 *     Injection  = Us cheez ko class mein pass karna
 *
 *
 * BEFORE vs AFTER (Architecture Comparison)
 *
 *     WITHOUT DI (tight coupling)          WITH DI (loose coupling)
 *     ---------------------------          -------------------------
 *     UserService                          AppDataSource
 *         |  (khud banata hai)                 |
 *         v                                    v
 *     AppDataSource                        Repository
 *         |                                    |  (bahar se milti hai)
 *         v                                    v
 *     Database                             UserService
 *
 *   -> Left: Service ko DB ka pura setup pata hai
 *   -> Right: Service ko sirf Repository milti hai, setup se koi lena-dena nahi
*/

/**
 * ────────────────────────────────────────────────────────────────
 * 2. DEPENDENCY INJECTION KYUN USE KARTE HAIN?
 * ────────────────────────────────────────────────────────────────
 *
 * - Teen important reasons hain:
 *     a. Easy Testing
 *     b. Loose Coupling
 *     c. Single Responsibility
 *
 * 2.1 EASY TESTING
 * - Maan lo UserService normally real database use karti hai.
 * - Testing ke time hum usse FAKE repository de sakte hain:
 *
 *     const fakeRepository = ...;
 *     const userService = new UserService(fakeRepository);
 *
 * - UserService ke andar kuch change nahi karna padta.
 * - Isse unit testing aasan ho jaati hai.
 *
 * 2.2 LOOSE COUPLING
 * - UserService ko ye jaanne ki zaroorat nahi:
 *     - Kaunsa database use ho raha hai
 *     - Connection kaise bana
 *     - Repository kaise bani
 * - Usse sirf wo repository milti hai jo usse chahiye.
 *
 *      UserService
 *          |
 *          ↓
 *      Repository
 *          |
 *          ↓
 *      Database
 *
 * - Isse classes loosely coupled rehti hain.
 *
 * 2.3 SINGLE RESPONSIBILITY
 * - Har component apne kaam par focus karta hai:
 *
 *     AppDataSource     -> Database connection
 *     Repository        -> Database operations
 *     UserService       -> User-related business logic
 *     TokenService      -> Token-related operations
 *     CredentialService -> Password operations
 *     AuthController    -> HTTP request/response handling
 *     Logger            -> Logging
 *
 * - Isse application samajhna aur maintain karna aasan ho jaata hai.
*/

/**
 * ────────────────────────────────────────────────────────────────
 * 3. STEP 1 -- DATABASE CONNECTION BANAO
 * ────────────────────────────────────────────────────────────────
 *
 * - Repositories banane se pehle database connection chahiye.
 * - Is project mein AppDataSource database configuration handle karta hai.
 *
 * - Example: config/data-source.ts
 *
 *     export const AppDataSource = new DataSource({
 *         type: "postgres",
 *         host: Config.DB_HOST ?? "localhost",
 *         port: Number(Config.DB_PORT) || 5432,
 *         username: Config.DB_USERNAME ?? "root",
 *         password: Config.DB_PASSWORD ?? "root",
 *         database: Config.DB_NAME ?? "test",
 *         synchronize: true,
 *         entities: [
 *             User,
 *             RefreshToken
 *         ],
 *     });
 *
 * - IMPORTANT:
 *   AppDataSource = Wo object jo application ko database se
 *                   configure/connect karta hai.
 *
 *
 * `entities` KA MATLAB KYA HAI?
 *
 *     entities: [
 *         User,
 *         RefreshToken
 *     ]
 *
 * - Ye TypeORM ko batata hai:
 *   "In database entities ke baare mein is DataSource ko pata hai."
 * - Conceptually:
 *     User Entity         -> User Table
 *     RefreshToken Entity -> RefreshToken Table
 *
 * Example:
 *
 *     @Entity()
 *     export class RefreshToken {
 *
 *         @PrimaryGeneratedColumn()
 *         id: number;
 *
 *         @Column({ type: "timestamp" })
 *         expiresAt: Date;
 *
 *         @ManyToOne(() => User)
 *         user: User;
 *
 *     }
 *
 * IMPORTANT IDEA
 * - DataSource ko hum normally EK BAAR banate hain aur reuse karte hain.
 * - Har baar repository chahiye to naya database connection NAHI banate.
*/

/**
 * ────────────────────────────────────────────────────────────────
 * 4. STEP 2 -- DATASOURCE SE REPOSITORY LO
 * ────────────────────────────────────────────────────────────────
 *
 * - Ab AppDataSource ready hai, to hum repositories le sakte hain.
 * - Example:
 *
 *     const userRepository = AppDataSource.getRepository(User);
 *     const refreshTokenRepository = AppDataSource.getRepository(RefreshToken);
 *
 * - Repository ko aise samjho: ek object jo kisi ek entity ke liye
 *   database operations perform karne mein help karta hai.
 *
 *     userRepository
 *         |
 *         ↓
 *     User table
 *         |
 *         ├── find
 *         ├── save
 *         ├── update
 *         └── delete
 *
 * - Isi tarah:
 *     refreshTokenRepository -> RefreshToken table
 *
 * - Yaani:
 *     getRepository(User)         -> User Repository
 *     getRepository(RefreshToken) -> RefreshToken Repository
*/

/**
 * ────────────────────────────────────────────────────────────────
 * 5. STEP 3 -- REPOSITORIES KO SERVICES MEIN INJECT KARO
 * ────────────────────────────────────────────────────────────────
 *
 * - Ab repositories ready hain.
 * - Inhe unn services mein pass karo jinhe ye chahiye.
 *
 *     const userService  = new UserService(userRepository);
 *     const tokenService = new TokenService(refreshTokenRepository);
 *
 * - Ye hai ASLI Dependency Injection step.
 * - Flow:
 *     userRepository         -> UserService
 *     refreshTokenRepository -> TokenService
 *
 * - Important baat:
 *     UserService repository KHUD NAHI banati.
 *     TokenService repository KHUD NAHI banati.
 *     Repositories bahar banti hain aur inject hoti hain.
 *
 * YE BETTER KYUN HAI?
 * - Pehle:
 *     UserService -> AppDataSource -> Database
 *
 * - Ab:
 *     AppDataSource -> Repository -> UserService
 *
 * - Service ab database setup se ALAG ho gayi.
*/

/**
 * ────────────────────────────────────────────────────────────────
 * 6. CREDENTIAL SERVICE
 * ────────────────────────────────────────────────────────────────
 *
 * - Har service ko repository ki zaroorat nahi hoti.
 * - Example: CredentialService password-related kaam karti hai.
 *
 *     export class CredentialService {
 *         async comparePassword(
 *             userPassword: string,
 *             passwordHash: string
 *         ) {
 *             return await bcrypt.compare(
 *                 userPassword,
 *                 passwordHash
 *             );
 *         }
 *     }
 *
 * - Ise database repository nahi chahiye.
 * - Isliye: const credentialService = new CredentialService();
 * - Kuch inject karne ki zaroorat nahi.
 *
 * IMPORTANT:
 * - DI ka matlab ye NAHI ki har class ki dependencies honi hi chahiye.
 * - DI ka matlab: "Agar class ki dependencies hain, to unhe BAHAR se do."
*/

/**
 * ────────────────────────────────────────────────────────────────
 * 7. STEP 4 -- LOGGER BHI EK DEPENDENCY HAI
 * ────────────────────────────────────────────────────────────────
 *
 * - AuthController ko logger bhi chahiye.
 * - Example:
 *
 *     const logger = winston.createLogger({
 *         level: "info",
 *         transports: [
 *             new winston.transports.File({
 *                 filename: "combined.log"
 *             }),
 *             new winston.transports.File({
 *                 filename: "error.log",
 *                 level: "error"
 *             }),
 *             new winston.transports.Console({
 *                 level: "info"
 *             })
 *         ]
 *     });
 *
 * - Logger controller ke BAHAR banta hai, phir controller mein pass hota hai.
 *
 *     Logger
 *        |
 *        ↓
 *     AuthController
 *
 * - Phir wahi baat:
 *     Controller apni dependency khud nahi banata.
 *     Dependency bahar banti hai -> phir inject hoti hai.
*/

/**
 * ────────────────────────────────────────────────────────────────
 * 8. STEP 5 -- SAB KUCH AUTHCONTROLLER MEIN INJECT KARO
 * ────────────────────────────────────────────────────────────────
 *
 * - Ab humare paas ye sab hai:
 *     1. userService
 *     2. tokenService
 *     3. credentialService
 *     4. logger
 *
 * - In sabko AuthController mein inject karo:
 *
 *     const authController = new AuthController(
 *         userService,
 *         logger,
 *         tokenService,
 *         credentialService
 *     );
 *
 * - Controller inhe constructor se receive karta hai:
 *
 *     export class AuthController {
 *         constructor(
 *             private userService: UserService,
 *             private logger: Logger,
 *             private tokenService: TokenService,
 *             private credentialService: CredentialService
 *         ) {}
 *     }
 *
 * - Ab AuthController ke andar hum use kar sakte hain:
 *     this.userService
 *     this.logger
 *     this.tokenService
 *     this.credentialService
 *   bina inhe dobara banaye.
*/

/**
 * ────────────────────────────────────────────────────────────────
 * 9. COMPLETE DEPENDENCY INJECTION FLOW (Wiring Map)
 * ────────────────────────────────────────────────────────────────
 *
 * - Ab sab kuch connected hai:
 *
 *     AppDataSource
 *           |
 *           | getRepository(User)
 *           ↓
 *     userRepository
 *           |
 *           | inject
 *           ↓
 *     UserService
 *
 *
 *     AppDataSource
 *           |
 *           | getRepository(RefreshToken)
 *           ↓
 *     refreshTokenRepository
 *           |
 *           | inject
 *           ↓
 *     TokenService
 *
 *
 *     UserService ───────┐
 *     TokenService ──────┼──────> AuthController
 *     CredentialService ─┤
 *     Logger ────────────┘
 *
 * - In sabhi objects ko jodne ke process ko kehte hain:
 *    "Wiring the application"
 *
 * - Ye wiring `routes/auth.ts` file mein hoti hai (application start
 *   hote hi, ek baar):
 *
 *     STARTUP (ek baar)                       RUNTIME (har request par)
 *     -----------------                       -------------------------
 *     DataSource banao                        Request aati hai
 *       -> Repositories nikaalo                 -> Route
 *         -> Services banao                       -> Middleware
 *           -> Controller banao                     -> Controller (ready-made)
 *             -> Routes se jodo                       -> Service -> Repository -> DB
*/

/**
 * ────────────────────────────────────────────────────────────────
 * 10. STEP 6 -- CONTROLLER KO ROUTES SE CONNECT KARO
 * ────────────────────────────────────────────────────────────────
 *
 * - AuthController ready hone ke baad, routes HTTP requests ko
 *   controller methods se jodte hain.
 * - Example:
 *
 *     const router = express.Router();
 *
 *     router.post(
 *         "/register",
 *         registerValidator,
 *         (req, res, next) =>
 *             authController.register(req, res, next)
 *     );
 *
 *     router.post(
 *         "/login",
 *         loginValidator,
 *         (req, res, next) =>
 *             authController.login(req, res, next)
 *     );
 *
 *     router.get(
 *         "/self",
 *         authenticate,
 *         (req, res) =>
 *             authController.self(req as AuthRequest, res)
 *     );
 *
 *     export default router;
 *
 * - General flow:
 *
 *     HTTP Request
 *           ↓
 *         Route
 *           ↓
 *       Middleware
 *           ↓
 *       Controller
 *           ↓
 *        Service
 *           ↓
 *       Repository
 *           ↓
 *       Database
 *
 * - Arrow function (`(req, res, next) => authController.login(...)`)
 *   isliye use hota hai taaki `authController` ka `this` context
 *   sahi rahe jab Express is function ko call kare.
*/

/**
 * ────────────────────────────────────────────────────────────────
 * 11. MIDDLEWARE KYUN USE KARTE HAIN?
 * ────────────────────────────────────────────────────────────────
 *
 * - Example:
 *
 *     router.post(
 *         "/login",
 *         loginValidator,
 *         (req, res, next) =>
 *             authController.login(req, res, next)
 *     );
 *
 * - Yaha do important steps hain:
 *     1. loginValidator chalta hai
 *     2. AuthController.login() chalta hai
 *
 * - Agar validation fail ho jaaye:
 *
 *     Request
 *        ↓
 *     Validator
 *        ↓
 *     Invalid
 *        ↓
 *     400 Response
 *
 * - Controller aage NAHI chalta.
 *
 * - Protected route ke liye:
 *
 *     router.get(
 *         "/self",
 *         authenticate,
 *         ...
 *     );
 *
 * - Flow:
 *
 *     Request
 *        ↓
 *     authenticate
 *        ↓
 *     Token valid hai?
 *        ↓
 *     Haan
 *        ↓
 *     AuthController.self()
 *
 *
 * MIDDLEWARE PIPELINE (Architecture)
 *
 *     Request
 *        |
 *        v
 *   ┌──────────────┐  fail   ┌─────────────────┐
 *   │ Middleware 1 │ ──────> │ Error Response  │ (400 / 401)
 *   └──────────────┘         └─────────────────┘
 *        | pass
 *        v
 *   ┌──────────────┐
 *   │  Controller  │ ──> Service ──> Repository ──> Database
 *   └──────────────┘
 *
 *   Rule: Middleware ek "gatekeeper" hai. Jab tak wo pass na kare,
 *   controller tak request pahunchti hi nahi.
*/

/**
 * ----------------------------------------------------------------
 * PART 1 RECAP
 * ----------------------------------------------------------------
 * - DI = class ko uski dependency BAHAR se milti hai
 * - AppDataSource -> Repository -> Service -> Controller -> Route
 * - CredentialService ko repository nahi chahiye, isliye kuch inject nahi hota
 * - Wiring app start par ek baar hoti hai (routes/auth.ts mein)
 * - Middleware = gatekeeper, fail hone par controller nahi chalta
 */


/**
 * Topic: Login Endpoint, Tokens, Cookies
 *
 * PICHLE PART SE CONNECTION
 * - Part 1 mein humne dekha ki AuthController ko saari dependencies
 *   (userService, tokenService, credentialService, logger) inject
 *   ho chuki hain.
 * - Ab dekhte hain ki `authController.login()` ke ANDAR kya hota hai.
*/

/**
 * ────────────────────────────────────────────────────────────────
 * 12. LOGIN ENDPOINT
 * ────────────────────────────────────────────────────────────────
 *
 * - Ab actual login process samjhte hain.
 * - Endpoint: POST /auth/login
 * - Client ye bhejta hai:
 *
 *     {
 *         "email": "user@example.com",
 *         "password": "password"
 *     }
 *
 * - Complete login flow:
 *
 *     Client
 *       ↓
 *     Request validate karo
 *       ↓
 *     User dhundo
 *       ↓
 *     Password compare karo
 *       ↓
 *     Access token banao
 *       ↓
 *     Refresh-token ka database record banao
 *       ↓
 *     Refresh token banao
 *       ↓
 *     Tokens ko cookies mein bhejo
 *       ↓
 *     User ID return karo
 *
 *
 * LOGIN ARCHITECTURE (kaun kaunse components involve hain)
 *
 *     Client
 *       |  POST /auth/login { email, password }
 *       v
 *     loginValidator ──(invalid)──> 400 Bad Request
 *       | (valid)
 *       v
 *     AuthController.login()
 *       |
 *       ├──> UserService ─────────> Repository ──> Database (user dhundo)
 *       |
 *       ├──> CredentialService ───> bcrypt (password compare)
 *       |
 *       └──> TokenService
 *              ├── generateAccessToken()   -> private key se sign
 *              ├── persistRefreshToken()   -> Database (record save)
 *              └── generateRefreshToken()  -> secret se sign
 *       |
 *       v
 *     Cookies (accessToken + refreshToken)  +  { id: user.id }
*/

/**
 * ────────────────────────────────────────────────────────────────
 * 13. LOGIN -- STEP 1: REQUEST VALIDATE KARO
 * ────────────────────────────────────────────────────────────────
 *
 * - Sabse pehle incoming request validate karo.
 *
 *     const result = validationResult(req);
 *     if (!result.isEmpty()) {
 *         return res
 *             .status(400)
 *             .json({
 *                 errors: result.array()
 *             });
 *     }
 *
 * - Validation ye cheezein check kar sakti hai:
 *     - Email present hai?
 *     - Email valid hai?
 *     - Password present hai?
 *
 * - Agar validation fail ho:
 *
 *     Request
 *        ↓
 *     Validation
 *        ↓
 *     Invalid
 *        ↓
 *     400 Bad Request
 *
 * - Login process yahin ruk jaata hai.
*/

/**
 * ────────────────────────────────────────────────────────────────
 * 14. LOGIN -- STEP 2: USER DHUNDO
 * ────────────────────────────────────────────────────────────────
 *
 * - Email aur password nikaalo:
 *
 *     const {
 *         email,
 *         password
 *     } = req.body;
 *
 * - Phir user search karo:
 *
 *     const user = await this.userService.findByEmail(email);
 *
 * - Agar user exist nahi karta:
 *
 *     if (!user) {
 *         const error =
 *             createHttpError(
 *                 400,
 *                 "Email or password does not match."
 *             );
 *         next(error);
 *         return;
 *     }
 *
 * IMPORTANT:
 * - Hum jaanbujh kar DONO cases ke liye SAME error message use karte hain:
 *     1. User exist nahi karta
 *     2. Password galat hai
 * - Kyun? Warna attacker pata laga sakta hai ki kaunse email addresses
 *   registered hain (user enumeration).
 *
 * Example:
 * - Ye MAT use karo:
 *     "Email does not exist"
 *     "Wrong password"
 * - Iske bajaye ye use karo:
 *     "Email or password does not match."
 * - Isse unnecessary information leak nahi hoti.
*/

/**
 * ────────────────────────────────────────────────────────────────
 * 15. LOGIN -- STEP 3: PASSWORD COMPARE KARO
 * ────────────────────────────────────────────────────────────────
 *
 * - Database mein password HASH store hota hai, plain password nahi.
 * - Hum compare karte hain:
 *
 *     User ka enter kiya password
 *               ↓
 *             bcrypt
 *               ↓
 *       Stored password hash
 *
 * - Code:
 *
 *     const passwordMatch =
 *         await this.credentialService.comparePassword(
 *             password,
 *             user.password
 *         );
 *
 * - Agar password match nahi karta:
 *
 *     if (!passwordMatch) {
 *         const error =
 *             createHttpError(
 *                 400,
 *                 "Email or password does not match."
 *             );
 *         next(error);
 *         return;
 *     }
 *
 * - Agar match karta hai: login aage badhta hai.
*/

/**
 * ────────────────────────────────────────────────────────────────
 * 16. LOGIN -- STEP 4: JWT PAYLOAD BANAO
 * ────────────────────────────────────────────────────────────────
 *
 * - Successful authentication ke baad token ka payload banao.
 *
 *     const payload = {
 *         sub: String(user.id),
 *         role: user.role
 *     };
 *
 * - Yaha: sub = Subject
 * - Ye usually user ko identify karta hai.
 * - Example:
 *
 *     {
 *         sub: "123",
 *         role: "admin"
 *     }
 *
 * - Token ke andar SIRF wahi information daalo jo sach mein zaroori hai.
*/

/**
 * ────────────────────────────────────────────────────────────────
 * 17. LOGIN -- STEP 5: ACCESS TOKEN GENERATE KARO
 * ────────────────────────────────────────────────────────────────
 *
 * - Ab access token banao:
 *
 *     const accessToken =
 *         this.tokenService.generateAccessToken(
 *             payload
 *         );
 *
 * - Is architecture mein access token sign hota hai:
 *
 *     RSA Private Key
 *           +
 *         RS256
 *           ↓
 *          JWT
 *
 * - Important: Private key -> JWT ko SIGN karti hai
 * - Private key SECRET rehni chahiye.
*/

/**
 * ────────────────────────────────────────────────────────────────
 * 18. LOGIN -- STEP 6: REFRESH TOKEN RECORD BANAO
 * ────────────────────────────────────────────────────────────────
 *
 * - Refresh JWT banane se PEHLE, database mein ek record banao:
 *
 *     const newRefreshToken =
 *         await this.tokenService.persistRefreshToken(
 *             user
 *         );
 *
 * - Ye kyun karte hain?
 *   Kyunki refresh-token record ko ek database ID milti hai.
 * - Example:
 *
 *     RefreshToken table:
 *     - id = 25
 *     - userId = 123
 *     - expiresAt = ...
 *
 * - Ye ID baad mein refresh JWT ke andar include ki ja sakti hai.
*/

/**
 * ────────────────────────────────────────────────────────────────
 * 19. LOGIN -- STEP 7: REFRESH TOKEN GENERATE KARO
 * ────────────────────────────────────────────────────────────────
 *
 * - Ab refresh token generate karo:
 *
 *     const refreshToken =
 *         this.tokenService.generateRefreshToken({
 *             ...payload,
 *             id: String(newRefreshToken.id)
 *         });
 *
 * - Ab refresh token mein ye ho sakta hai:
 *
 *     {
 *         sub: "123",
 *         role: "user",
 *         id: "25"
 *     }
 *
 * - Yaha: id = RefreshToken database record ki ID
 * - Isi wajah se:
 *
 *     persistRefreshToken()
 *             ↓
 *     PEHLE hona chahiye
 *             ↓
 *     generateRefreshToken() se
 *
 *
 * TOKEN CREATION ARCHITECTURE (Access vs Refresh)
 *
 *     payload { sub, role }
 *        |
 *        ├──────────────────────────────┐
 *        v                              v
 *   ACCESS TOKEN                   REFRESH TOKEN
 *   sign: RSA private key          sign: shared secret (REFRESH_TOKEN_SECRET)
 *   algo: RS256                    algo: HS256
 *   life: chhoti (1 hour)          life: lambi (1 year)
 *   DB me save: NAHI               DB me save: HAAN (id -> jti)
 *   kaam: API access               kaam: naya access token lena
*/

/**
 * ────────────────────────────────────────────────────────────────
 * 20. LOGIN -- STEP 8: ACCESS TOKEN COOKIE MEIN BHEJO
 * ────────────────────────────────────────────────────────────────
 *
 * - Access token cookie mein store hota hai:
 *
 *     res.cookie(
 *         "accessToken",
 *         accessToken,
 *         {
 *             domain: "localhost",
 *             sameSite: "strict",
 *             maxAge: 1000 * 60 * 60,
 *             httpOnly: true
 *         }
 *     );
 *
 * - Important property: httpOnly: true
 * - Iska matlab browser ka JavaScript is cookie ko directly READ nahi kar sakta.
 * - Isse XSS scenario mein client-side JavaScript ke through token
 *   expose hone ka risk kam hota hai.
*/

/**
 * ────────────────────────────────────────────────────────────────
 * 21. LOGIN -- STEP 9: REFRESH TOKEN COOKIE MEIN BHEJO
 * ────────────────────────────────────────────────────────────────
 *
 * - Refresh token bhi cookie mein store hota hai:
 *
 *     res.cookie(
 *         "refreshToken",
 *         refreshToken,
 *         {
 *             domain: "localhost",
 *             sameSite: "strict",
 *             maxAge: 1000 * 60 * 60 * 24 * 365,
 *             httpOnly: true
 *         }
 *     );
 *
 * Conceptually:
 *
 *     accessToken
 *         -> chhoti lifetime
 *         -> API access ke liye use hota hai
 *
 *     refreshToken
 *         -> lambi lifetime
 *         -> naye access tokens lene ke liye use hota hai
*/

/**
 * ────────────────────────────────────────────────────────────────
 * 22. LOGIN -- STEP 10: RESPONSE BHEJO
 * ────────────────────────────────────────────────────────────────
 *
 * - Aakhir mein:
 *
 *     this.logger.info(
 *         "User has been logged in",
 *         {
 *             id: user.id
 *         }
 *     );
 *
 *     res
 *         .status(200)
 *         .json({
 *             id: user.id
 *         });
 *
 * Dhyan do:
 * - Hum ye NAHI bhejte:
 *     - Password
 *     - Access token
 *     - Refresh token
 * - Tokens already cookies mein store ho chuke hain.
 *
 *
 * COOKIE / RESPONSE ARCHITECTURE
 *
 *     Server                                   Browser
 *       |                                         |
 *       |-- Set-Cookie: accessToken=... --------> | (httpOnly -> JS read nahi kar sakti)
 *       |-- Set-Cookie: refreshToken=... -------> | (httpOnly, sameSite=strict)
 *       |-- Body: { id: 123 } ------------------> | (sirf id, tokens body mein nahi)
 *       |                                         |
 *       |<-- Next requests: Cookie header auto -- | (browser khud cookies bhej deta hai)
*/

/**
 * ────────────────────────────────────────────────────────────────
 * 23. COMPLETE LOGIN CODE
 * ────────────────────────────────────────────────────────────────
 *
 *     async login(req, res, next) {
 *
 *         // STEP 1: Request validate karo
 *         const result = validationResult(req);
 *         if (!result.isEmpty()) {
 *             return res
 *                 .status(400)
 *                 .json({
 *                     errors: result.array()
 *                 });
 *         }
 *
 *         const { email, password } = req.body;
 *         try {
 *             // STEP 2: User dhundo
 *             const user = await this.userService.findByEmail(
 *                     email
 *                 );
 *
 *
 *             if (!user) {
 *                 const error =
 *                     createHttpError(
 *                         400,
 *                         "Email or password does not match."
 *                     );
 *                 next(error);
 *                 return;
 *             }
 *
 *             // STEP 3: Password compare karo
 *             const passwordMatch =
 *                 await this.credentialService.comparePassword(
 *                     password,
 *                     user.password
 *                 );
 *
 *             if (!passwordMatch) {
 *                 const error =
 *                     createHttpError(
 *                         400,
 *                         "Email or password does not match."
 *                     );
 *                 next(error);
 *                 return;
 *             }
 *
 *             // STEP 4: JWT payload banao
 *             const payload = {
 *                 sub: String(user.id),
 *                 role: user.role
 *             };
 *
 *             // STEP 5: Access token generate karo
 *             const accessToken =
 *                 this.tokenService.generateAccessToken(
 *                     payload
 *                 );
 *
 *             // STEP 6: Refresh-token record persist karo
 *             const newRefreshToken =
 *                 await this.tokenService.persistRefreshToken(
 *                     user
 *                 );
 *
 *             // STEP 7: Refresh token generate karo
 *             const refreshToken = this.tokenService.generateRefreshToken({
 *                     ...payload,
 *                     id: String(newRefreshToken.id)
 *                 });
 *
 *             // STEP 8: Access token cookie mein store karo
 *             res.cookie(
 *                 "accessToken",
 *                 accessToken,
 *                 {
 *                     domain: "localhost",
 *                     sameSite: "strict",
 *                     maxAge: 1000 * 60 * 60,
 *                     httpOnly: true
 *                 }
 *             );
 *
 *             // STEP 9: Refresh token cookie mein store karo
 *             res.cookie(
 *                 "refreshToken",
 *                 refreshToken,
 *                 {
 *                     domain: "localhost",
 *                     sameSite: "strict",
 *                     maxAge: 1000 * 60 * 60 * 24 * 365,
 *                     httpOnly: true
 *                 }
 *             );
 *
 *             // STEP 10: Safe response return karo
 *             this.logger.info(
 *                 "User has been logged in",
 *                 {
 *                     id: user.id
 *                 }
 *             );
 *
 *             res
 *                 .status(200)
 *                 .json({
 *                     id: user.id
 *                 });
 *
 *         } catch (err) {
 *             next(err);
 *             return;
 *         }
 *     }
*/

/**
 * ────────────────────────────────────────────────────────────────
 * 24. LOGIN FLOW -- EK NAZAR MEIN
 * ────────────────────────────────────────────────────────────────
 *
 *     Client
 *        |
 *        | POST /auth/login
 *        | { email, password }
 *        ↓
 *     Validator
 *        |
 *        | valid?
 *        ↓
 *     AuthController.login()
 *        |
 *        ├── UserService.findByEmail()
 *        |        ↓
 *        |      Database
 *        |
 *        ├── CredentialService.comparePassword()
 *        |
 *        ├── generateAccessToken()
 *        |
 *        ├── persistRefreshToken()
 *        |        ↓
 *        |      Database
 *        |
 *        ├── generateRefreshToken()
 *        |
 *        ↓
 *     HTTP Cookies
 *        |
 *        ↓
 *     { id: user.id }
 *
 *
 * LOGIN -- ERROR PATHS (kahan kahan se request wapas ho sakti hai)
 *
 *     Request
 *        |
 *        v
 *     Validation fail? ──────── yes ──> 400 { errors: [...] }
 *        | no
 *        v
 *     User mila? ────────────── no ───> 400 "Email or password does not match."
 *        | yes
 *        v
 *     Password match? ───────── no ───> 400 "Email or password does not match."
 *        | yes
 *        v
 *     Tokens banao -> Cookies set -> 200 { id }
 *        |
 *        v  (koi bhi unexpected error)
 *     catch (err) -> next(err) -> centralized error handler
*/

/**
 * ----------------------------------------------------------------
 * PART 2 RECAP
 * ----------------------------------------------------------------
 * - Login order: validate -> user dhundo -> password compare -> payload
 *   -> access token -> refresh record persist -> refresh token -> cookies -> { id }
 * - Same error message dono failure cases mein (user enumeration se bachne ke liye)
 * - Refresh record PEHLE persist hota hai kyunki uski id refresh JWT mein jaati hai
 * - Access token: RS256 + private key | Refresh token: HS256 + shared secret
 * - Tokens cookies mein (httpOnly), response body mein sirf user id
 */


/**
 * Topic: Protected Routes, JWT Verification, /self, Password Removal
 *
 * PICHLE PART SE CONNECTION
 * - Part 2 mein login ke baad client ke paas cookies mein
 *   accessToken aur refreshToken aa gaye.
 * - Ab dekhte hain jab client PROTECTED route hit karta hai to
 *   server us token ko kaise VERIFY karta hai.
*/

/**
 * ────────────────────────────────────────────────────────────────
 * 25. PROTECTED ROUTES
 * ────────────────────────────────────────────────────────────────
 *
 * - Login ke baad client ke paas ek access token hai.
 * - Ab maan lo client ye request karta hai: GET /auth/self
 * - Ye ek protected route hai.
 *
 * Example:
 *
 *     router.get(
 *         "/self",
 *         authenticate,
 *         (req, res) =>
 *             authController.self(
 *                 req as AuthRequest,
 *                 res
 *             )
 *     );
 *
 * Dhyan do:
 * - authenticate -> AuthController.self()
 * - `authenticate` middleware PEHLE chalta hai.
*/

/**
 * ────────────────────────────────────────────────────────────────
 * 26. AUTHENTICATE KYA KARTA HAI?
 * ────────────────────────────────────────────────────────────────
 *
 * - Middleware ko ek sawal ka jawab dena hai: "Kya access token valid hai?"
 * - Flow:
 *
 *     Client
 *        |
 *        | GET /auth/self
 *        ↓
 *     authenticate middleware
 *        |
 *        ├── Token nikaalo
 *        |
 *        ├── Sahi public key dhundo
 *        |
 *        ├── JWT signature verify karo
 *        |
 *        ├── Invalid -> 401
 *        |
 *        └── Valid -> req.auth
 *                        ↓
 *                   Controller
 *
 *
 * AUTHENTICATE MIDDLEWARE -- INTERNAL ARCHITECTURE
 *
 *     authenticate = expressjwt({ ... })
 *                         |
 *          ┌──────────────┼───────────────────┐
 *          v              v                   v
 *      getToken()   secret (jwks-rsa)    algorithms: ['RS256']
 *   (token kahan     (public key kahan    (kaunsa algorithm
 *    se nikaalna)     se laani hai)        allowed hai)
 *          |              |                   |
 *          └──────────────┴─────────┬─────────┘
 *                                   v
 *                        JWT signature verify
 *                                   |
 *                      ┌────────────┴────────────┐
 *                      v                         v
 *                  INVALID                     VALID
 *                  401 error              req.auth = payload
*/

/**
 * ────────────────────────────────────────────────────────────────
 * 27. JWT VERIFICATION
 * ────────────────────────────────────────────────────────────────
 *
 * - Application `express-jwt` aur `jwks-rsa` use karti hai.
 * - Example:
 *
 *     export default expressjwt({
 *
 *         secret:
 *             jwksClient.expressJwtSecret({
 *                 jwksUri:
 *                     Config.JWKS_URI!,
 *                 cache: true,
 *                 rateLimit: true
 *             }) as GetVerificationKey,
 *         algorithms: [
 *             "RS256"
 *         ],
 *
 *         getToken(req: Request) {
 *             // STEP 1: Authorization header check karo
 *             const authHeader = req.headers.authorization;
 *             if (
 *                 authHeader &&
 *                 authHeader.split(" ")[1]
 *                     !== "undefined"
 *             ) {
 *
 *                 const token = authHeader.split(" ")[1];
 *                 if (token) {
 *                     return token;
 *                 }
 *             }
 *
 *
 *             // STEP 2: Agar header mein token nahi hai, to cookie check karo.
 *             type AuthCookie = {
 *                 accessToken: string;
 *             };
 *
 *             const { accessToken } = req.cookies as AuthCookie;
 *             return accessToken;
 *         }
 *
 *     });
*/

/**
 * ────────────────────────────────────────────────────────────────
 * 28. getToken() KAISE KAAM KARTA HAI
 * ────────────────────────────────────────────────────────────────
 *
 * - Middleware sabse pehle check karta hai: Authorization header
 * - Example: Authorization: Bearer <token>
 *
 * Agar wahan token nahi mila, to cookie check karta hai:
 *
 *     accessToken
 *
 * Flow:
 *
 *     Request
 *        |
 *        ├── Authorization header hai?
 *        |       |
 *        |       └── Haan -> is token ko use karo
 *        |
 *        └── Nahi
 *            |
 *            └── Cookie check karo
 *                    |
 *                    └── accessToken
 *
 * Isse browser aur mobile jaise clients apne supported tareeke se
 * token provide kar sakte hain.
 *
 *
 * getToken() DECISION TREE (Architecture)
 *
 *                    Request aayi
 *                         |
 *                         v
 *        Authorization header present + "Bearer <token>"?
 *              |                              |
 *             YES                             NO
 *              |                              |
 *     token "undefined" nahi?          req.cookies.accessToken
 *         |          |                        |
 *        YES        NO                        v
 *         |          |                  return cookie token
 *         v          └────────────────────────┘
 *   return header token
 *
 *   Note: "undefined" string check isliye hai kyunki kabhi kabhi
 *   frontend galti se "Bearer undefined" bhej deta hai.
*/

/**
 * ────────────────────────────────────────────────────────────────
 * 29. jwks-rsa KYA KARTA HAI?
 * ────────────────────────────────────────────────────────────────
 * - JWT PRIVATE key se sign hua tha.
 * - API server ke paas private key NAHI honi chahiye.
 * - Usse corresponding PUBLIC key chahiye.
 *
 * - Public keys ek JWKS endpoint ke through expose hoti hain.
 * - Example: /.well-known/jwks.json
 *
 * - `jwks-rsa` us endpoint se public keys fetch kar sakta hai
 *   aur JWT verification ke liye sahi key provide karta hai.
*/

/**
 * ────────────────────────────────────────────────────────────────
 * 30. "kid" KYUN IMPORTANT HAI?
 * ────────────────────────────────────────────────────────────────
 *
 * - JWT header mein ye ho sakta hai:
 *     {
 *         "alg": "RS256",
 *         "kid": "key-123"
 *     }
 *
 * - `kid` ka matlab: Key ID
 * - Ye verification system ko batata hai:
 *   "Is JWT ko verify karne ke liye kaunsi public key use karni hai?"
 *
 * - Verification flow:
 *
 *     JWT
 *       ↓
 *     "kid" padho
 *       ↓
 *     JWKS request karo
 *       ↓
 *     Matching "kid" dhundo
 *       ↓
 *     Public key lo
 *       ↓
 *     JWT signature verify karo
*/

/**
 * ────────────────────────────────────────────────────────────────
 * 31. algorithms: ['RS256'] KYA KARTA HAI?
 * ────────────────────────────────────────────────────────────────
 * - Example: algorithms: ["RS256"]
 * - Ye JWT middleware ko batata hai:
 *   "Sirf RS256 se sign hue JWTs accept karo."
 *
 * - Ye ek additional verification/security check hai.
 * - Application kisi bhi algorithm ko aise hi accept nahi kar rahi.
*/

/**
 * ────────────────────────────────────────────────────────────────
 * 32. cache: true KYA KARTA HAI?
 * ────────────────────────────────────────────────────────────────
 * - Example: cache: true
 * - Public key cache ho sakti hai.
 * - Isliye application ko har token verify karte waqt JWKS endpoint
 *   fetch karne ki zaroorat nahi hoti.
 *
 * - Conceptually:
 *
 *     Pehli request
 *          ↓
 *     Public key fetch karo
 *          ↓
 *     Key cache karo
 *
 *
 *     Agli requests
 *          ↓
 *     Jaha appropriate ho, cached key reuse karo
 *
 *
 * CACHE TIMELINE (Architecture)
 *
 *     Request 1 ──> cache MISS ──> JWKS endpoint se key fetch ──> cache mein save
 *     Request 2 ──> cache HIT  ──> seedha cached key use (network call nahi)
 *     Request 3 ──> cache HIT  ──> seedha cached key use (network call nahi)
 *
 *     rateLimit: true -> agar bahut saari requests ek saath aayein,
 *     tab bhi JWKS endpoint par limited calls hi jaayengi (overload se bachav).
*/

/**
 * ────────────────────────────────────────────────────────────────
 * 33. JWT VERIFICATION KE BAAD KYA HOTA HAI?
 * ────────────────────────────────────────────────────────────────
 *
 * Agar token invalid hai:
 *
 *     JWT verification
 *           ↓
 *        INVALID
 *           ↓
 *     401 Unauthorized
 *
 *
 * Controller NAHI chalta.
 *
 *
 * Agar token valid hai:
 *
 *     JWT verification
 *           ↓
 *         VALID
 *           ↓
 *     req.auth populate hota hai
 *           ↓
 *     Controller chalta hai
 *
 *
 * Example:
 *
 *     req.auth = {
 *
 *         sub: "123",
 *
 *         role: "user",
 *
 *         ...
 *
 *     };
 *
 *
 * Ab controller user ID yaha se use kar sakta hai:
 *
 *     req.auth.sub
*/

/**
 * ────────────────────────────────────────────────────────────────
 * 34. GET /AUTH/SELF
 * ────────────────────────────────────────────────────────────────
 *
 * Authentication succeed hone ke baad, controller JWT ki ID se
 * user dhundh sakta hai.
 *
 * Example:
 *
 *     async self(
 *         req: AuthRequest,
 *         res: Response
 *     ) {
 *
 *         const user =
 *             await this.userService.findById(
 *                 Number(req.auth.sub)
 *             );
 *
 *
 *         res.json({
 *
 *             user: {
 *                 ...user,
 *
 *                 password: undefined
 *             }
 *
 *         });
 *
 *     }
 *
 *
 * Flow:
 *
 *     JWT
 *       ↓
 *     req.auth.sub
 *       ↓
 *     User ID
 *       ↓
 *     findById()
 *       ↓
 *     Database
 *       ↓
 *     User
 *       ↓
 *     Password hatao
 *       ↓
 *     Response
 *
 *
 * /auth/self -- SEQUENCE DIAGRAM (Architecture)
 *
 *   Client        authenticate      jwks-rsa/JWKS      AuthController     Database
 *     |                |                 |                   |               |
 *     |-- GET /self -->|                 |                   |               |
 *     |                |-- getToken()    |                   |               |
 *     |                |-- kid se key -->|                   |               |
 *     |                |<-- public key --|                   |               |
 *     |                |-- verify sig    |                   |               |
 *     |                |                 |                   |               |
 *     |   INVALID: <---|-- 401           |                   |               |
 *     |                |                 |                   |               |
 *     |   VALID:       |-- req.auth ----------------------->|               |
 *     |                |                 |                   |-- findById -->|
 *     |                |                 |                   |<-- user ------|
 *     |                |                 |                   |-- password    |
 *     |                |                 |                   |   hatao       |
 *     |<------------------------ { user: {...} } ------------|               |
*/

/**
 * ────────────────────────────────────────────────────────────────
 * 35. RESPONSE SE PASSWORD KYUN HATAAYEIN?
 * ────────────────────────────────────────────────────────────────
 *
 * Database ke user object mein ye ho sakta hai:
 *
 *     {
 *         id: 123,
 *         email: "user@example.com",
 *         password: "HASHED_PASSWORD",
 *         role: "user"
 *     }
 *
 *
 * Password hashed hone ke bawajood, use client ko nahi bhejna chahiye.
 *
 *
 * Iske bajaye:
 *
 *     res.json({
 *         user: {
 *             ...user,
 *             password: undefined
 *         }
 *     });
 *
 *
 * Kya hota hai?
 *
 * Pehle:
 *
 *     ...user
 *
 *
 * saare fields copy karta hai.
 *
 * Phir:
 *
 *     password: undefined
 *
 *
 * password field ko overwrite kar deta hai.
 *
 * Jab object JSON mein serialize hota hai,
 * `undefined` property omit ho jaati hai.
 *
 * Isliye client ko milta hai:
 *
 *     {
 *         "user": {
 *             "id": 123,
 *             "email": "user@example.com",
 *             "role": "user"
 *         }
 *     }
 *
 *
 * Password include nahi hota.
*/

/**
 * ────────────────────────────────────────────────────────────────
 * 36. YE KYUN IMPORTANT HAI?
 * ────────────────────────────────────────────────────────────────
 * - Sensitive information ko response boundary cross karne se
 *   PEHLE filter kar dena chahiye.
 * - Password hashed ho tab bhi:
 *   > Database
 *   > Password Hash
 *   > Server
 * - Wo hash unnecessarily yaha nahi pahunchna chahiye:
 *   > Server
 *   > Client
 * - Ye ek defense-in-depth practice hai.
 *
 * DATA BOUNDARY ARCHITECTURE:
 *
 *  ┌─────────────┐     ┌──────────────┐     ┌──────────┐
 *  │  Database   │ --> │    Server    │ -X> │  Client  │
 *  │ (password   │     │ (password    │     │ (password│
 *  │  hash hai)  │     │  yaha filter)│     │  nahi    │
 *  └─────────────┘     └──────────────┘     │  milta)  │
 *                                           └──────────┘
 * - Server hi wo "boundary" hai jaha sensitive fields hataye jaate hain.
*/

/**
 * ----------------------------------------------------------------
 * PART 3 RECAP
 * ----------------------------------------------------------------
 * - Protected route       : authenticate middleware PEHLE chalta hai, phir controller
 * - getToken()            : pehle Authorization header, nahi mila to cookie
 * - jwks-rsa              : JWKS endpoint se "kid" ke hisaab se public key laata hai
 * - algorithms: ['RS256'] : sirf RS256 signed tokens accept
 * - cache/rateLimit       : baar baar network call aur overload se bachav
 * - Valid token   -> req.auth set -> controller chalta hai
 * - Invalid token -> 401, controller nahi chalta
 * - /self: req.auth.sub se user nikaalo, response se password hatao
 */


/**
 * Topic: JWT, PEM, JWK, JWKS + Complete Architecture 
 *
 * PICHLE PART SE CONNECTION
 * - Part 3 mein humne dekha ki middleware `kid` ke through JWKS se
 *   public key laata hai.
 * - Ab in sab words (JWT, PEM, JWK, JWKS) ko ALAG ALAG aur
 *   clearly samjhenge, aur end mein poora architecture jodenge.
*/

/**
 * ────────────────────────────────────────────────────────────────
 * 37. AB JWT, PEM, JWK AUR JWKS SAMJHO
 * ────────────────────────────────────────────────────────────────
 * - Ye chaar terms aasaani se confuse ho jaate hain.
 * - Inhe alag alag yaad rakho:
 *   - JWT  : Authentication token
 *   - PEM  : Cryptographic keys ka file/storage format
 *   - JWK  : Ek cryptographic key jo JSON mein represent ki gayi ho
 *   - JWKS : JWKs ka collection
 *
 * - Simple memory trick:
 *   - JWT  = User ka ticket
 *   - JWK  = Ek key JSON ke roop mein
 *   - JWKS = JSON keys ka collection
*/

/**
 * ────────────────────────────────────────────────────────────────
 * 38. JWT KYA HAI?
 * ────────────────────────────────────────────────────────────────
 * - JWT = JSON Web Token
 * - Successful login ke baad server ek JWT banata hai.
 * - Conceptually:
 *   > Login successful
 *   > JWT banao
 *   > Client ko JWT do
 * - JWT mein claims aur ek digital signature hota hai.
 *
 * Example header:
 *     {
 *         "alg": "RS256",
 *         "kid": "key-123"
 *     }
 *
 * - JWT mein ye information ho sakti hai: sub, role
 * - Signature server ko verify karne deta hai ki token expected
 *   key se sign hua hai.
 *
 *
 * JWT STRUCTURE (Architecture):
 *
 *     xxxxxxxx . yyyyyyyy . zzzzzzzz
 *         |          |          |
 *      HEADER     PAYLOAD    SIGNATURE
 *    (alg, kid)  (sub, role)  (private key se bana)
 *
 * - Payload sirf encoded hota hai, encrypted NAHI
 *   isliye usme password jaisi sensitive cheezein kabhi mat daalo.
*/

/**
 * ────────────────────────────────────────────────────────────────
 * 39. PRIVATE KEY vs PUBLIC KEY
 * ────────────────────────────────────────────────────────────────
 *
 * RSA ek key pair use karta hai:
 *
 *     PRIVATE KEY
 *         ↓
 *     JWT ko SIGN karne ke liye use hoti hai
 *         ↓
 *     SECRET rehni chahiye
 *
 *
 *     PUBLIC KEY
 *         ↓
 *     JWT ko VERIFY karne ke liye use hoti hai
 *         ↓
 *     Share ki ja sakti hai
 *
 *
 * Simple flow:
 *
 *     Auth Server
 *          |
 *          | Private Key
 *          ↓
 *     JWT SIGN karo
 *          |
 *          ↓
 *        JWT
 *          |
 *          ↓
 *     API Server
 *          |
 *          | Public Key
 *          ↓
 *     JWT VERIFY karo
 *
 *
 * IMPORTANT:
 *
 *     Private key -> Sign
 *
 *     Public key -> Verify
 *
 *
 * TRUST ARCHITECTURE (kaun kya jaanta hai)
 *
 *   ┌──────────────────────┐              ┌──────────────────────┐
 *   │     AUTH SERVER      │              │      API SERVER      │
 *   │                      │              │                      │
 *   │  Private Key  [YES]  │              │  Private Key  [NO]   │
 *   │  Public Key   [YES]  │              │  Public Key   [YES]  │
 *   │                      │    JWT       │  (JWKS se leta hai)  │
 *   │  JWT SIGN karta hai ─┼────────────> │  JWT VERIFY karta hai│
 *   └──────────────────────┘              └──────────────────────┘
 *
 *   API Server sirf verify kar sakta hai, naye valid JWT BANA nahi
 *   sakta -- kyunki uske paas private key hai hi nahi.
 *
 *
 * ────────────────────────────────────────────────────────────────
 * 40. MULTIPLE SERVICES KI PROBLEM
 * ────────────────────────────────────────────────────────────────
 *
 * Imagine karo humare paas hai:
 *
 *     Auth Server
 *          |
 *          ├── API Server 1
 *          ├── API Server 2
 *          └── API Server 3
 *
 *
 * Auth Server JWTs banata hai.
 *
 * Saare API servers ko un JWTs ko verify karne ke liye
 * public key chahiye.
 *
 *
 * Ek simple approach ye hogi:
 *
 *     Public key copy karo
 *        ↓
 *     API-1
 *
 *
 *     Public key copy karo
 *        ↓
 *     API-2
 *
 *
 *     Public key copy karo
 *        ↓
 *     API-3
 *
 *
 * Lekin manually keys copy karna mushkil ho jaata hai,
 * khaaskar jab keys rotate ya update karni ho.
 *
 *
 * Yahin JWK/JWKS help karta hai.
 *
 *
 * ────────────────────────────────────────────────────────────────
 * 41. JWK KYA HAI?
 * ────────────────────────────────────────────────────────────────
 *
 * JWK = JSON Web Key
 *
 *
 * Ye ek cryptographic key ko JSON se represent karta hai.
 *
 * Example:
 *
 *     {
 *         "kty": "RSA",
 *         "use": "sig",
 *         "kid": "key-123",
 *         "n": "...",
 *         "e": "AQAB"
 *     }
 *
 *
 * Important fields:
 *
 *     kty
 *         -> Key type
 *
 *     use
 *         -> Intended use
 *
 *     kid
 *         -> Key ID
 *
 *     n
 *         -> RSA modulus
 *
 *     e
 *         -> RSA exponent
 *
 *
 * Humare authentication system ke liye,
 * JWK public RSA key ko represent karta hai.
 *
 *
 * ────────────────────────────────────────────────────────────────
 * 42. JWKS KYA HAI?
 * ────────────────────────────────────────────────────────────────
 *
 * JWKS = JSON Web Key Set
 *
 *
 * JWKS, JWKs ka ek collection hota hai.
 *
 * Example:
 *
 *     {
 *         "keys": [
 *
 *             {
 *                 "kty": "RSA",
 *                 "kid": "key-123",
 *                 "n": "...",
 *                 "e": "AQAB"
 *             },
 *
 *             {
 *                 "kty": "RSA",
 *                 "kid": "key-456",
 *                 "n": "...",
 *                 "e": "AQAB"
 *             }
 *
 *         ]
 *     }
 *
 *
 * Isliye yaad rakho:
 *
 *     JWK
 *         = ek key
 *
 *
 *     JWKS
 *         = bahut saari keys
*/

/**
 * ────────────────────────────────────────────────────────────────
 * 43. JWKS ENDPOINT
 * ────────────────────────────────────────────────────────────────
 * - Auth Server public keys ek endpoint ke through expose karta hai.
 * - Example: GET /.well-known/jwks.json
 *
 *
 * Architecture:
 *
 *     Auth Server
 *          |
 *          ↓
 *     JWKS Endpoint
 *          |
 *          ├──────────> API-1
 *          |
 *          ├──────────> API-2
 *          |
 *          └──────────> API-3
 *
 *
 * Note: Ab API servers public keys bina manually copy kiye obtain 
 *       kar sakte hain.
*/

/**
 * ────────────────────────────────────────────────────────────────
 * 44. "kid" JWT KO JWK SE KAISE JODTA HAI
 * ────────────────────────────────────────────────────────────────
 * - Maan lo JWT header mein hai:
 *   {
 *       "alg": "RS256",
 *       "kid": "key-123"
 *   }
 *
 * - API server ye karta hai:
 *   1. JWT receive karo
 *   2. JWT header padho
 *   3. Nikaalo: kid = "key-123"
 *   4. JWKS lo
 *   5. Search karo: kid = "key-123"
 *   6. Matching JWK lo
 *   7. Uski public-key information convert/use karo
 *   8. JWT signature verify karo
 *
 * - Yaani:
 *
 *        JWT
 *         |
 *         | kid = key-123
 *         ↓
 *       JWKS
 *         |
 *         | key-123 dhundo
 *         ↓
 *    Matching JWK
 *         |
 *         ↓
 *    Public Key
 *         |
 *         ↓
 *   JWT verify karo
 *
 *
 * KEY ROTATION ARCHITECTURE (kid ka asli fayda):
 *
 *     JWKS = { 
 *               keys: [ 
 *                        key-123 (purani), 
 *                        key-456 (nayi) 
 *                     ] 
 *            }
 *
 * a. Purana JWT (kid=key-123) ──> key-123 se verify   ✔ abhi bhi chalta hai
 * b. Naya JWT   (kid=key-456) ──> key-456 se verify   ✔
 *
 * Note: Isse Auth Server naye keys par shift ho sakta hai bina purane
 *       valid tokens ko todhe -- "kid" batata hai kaunsi key use karni hai.
*/

/**
 * ────────────────────────────────────────────────────────────────
 * 45. PEM FORMAT
 * ────────────────────────────────────────────────────────────────
 * - PEM koi doosri type ki cryptographic key NAHI hai.
 * - Ye ek text representation/storage format hai jo commonly
 *   cryptographic keys aur certificates ke liye use hota hai.
 *
 * Example:
 *
 *     -----BEGIN PRIVATE KEY-----
 *     ...
 *     -----END PRIVATE KEY-----
 *
 * Yaani: PEM = Cryptographic material store karne ka format
*/

/**
 * ────────────────────────────────────────────────────────────────
 * 46. PEM -> JWK CONVERT KARO
 * ────────────────────────────────────────────────────────────────
 * - Maan lo humare paas already hai: certs/private.pem
 * - Humein public key nikaalni hai aur use JWK ke roop mein represent karna hai.
 * - Flow:
 *   > private.pem
 *   > File padho
 *   > RSA key
 *   > Public portion nikaalo
 *   > JWK mein convert karo
 *   > JWK JSON
 *   > JWKS endpoint
*/

/**
 * ────────────────────────────────────────────────────────────────
 * 47. rsa-pem-to-jwk LIBRARY
 * ────────────────────────────────────────────────────────────────
 * - Package: rsa-pem-to-jwk
 * - Install: npm install rsa-pem-to-jwk
 * - Ye library RSA PEM key ko JWK format mein convert karti hai.
 *
 * - Example:
 *
 *     import fs from "fs";
 *     import rsaPemToJwk from "rsa-pem-to-jwk";
 *
 *     // STEP 1:  PEM file padho
 *     const privateKey = fs.readFileSync("./certs/private.pem");
 *
 *     // STEP 2: PUBLIC key ke liye JWK generate karo
 *     const jwk = rsaPemToJwk(privateKey, { use: "sig" }, "public");
 *
 *     // STEP 3: JWK object ko JSON string mein convert karo
 *     console.log(JSON.stringify(jwk));
 *
 *
 * - Example output:
 *    {
 *        "kty": "RSA",
 *        "use": "sig",
 *        "kid": "key-123",
 *        "n": "...",
 *        "e": "AQAB"
 *    }
*/

/**
 * ────────────────────────────────────────────────────────────────
 * 48. YAHA "public" KA MATLAB KYA HAI?
 * ────────────────────────────────────────────────────────────────
 * - Ye argument: "public" ka matlab hai:
 *   - "RSA key ke public portion ka JWK representation generate karo."
 *   - Hum private key ko expose NAHI karte.
 *
 * - Yaad rakho:
 *
 *     Private Key
 *         |
 *         └── JWKS ke through KABHI expose mat karo
 *
 *     Public Key
 *         |
 *         └── JWKS ke through expose ki ja sakti hai
*/

/**
 * ────────────────────────────────────────────────────────────────
 * 49. { use: "sig" } KA MATLAB KYA HAI?
 * ────────────────────────────────────────────────────────────────
 * - Example: { use: "sig" }
 * - Ye indicate karta hai ki key signature-related operations ke liye hai.
 * - Humare case mein:
 *
 *     JWT sign hota hai
 *          ↓
 *     Public key signature verify karti hai
 *
 * - Isliye public JWK signature verification ke liye use hota hai.
*/

/**
 * ────────────────────────────────────────────────────────────────
 * 50. LIBRARY KYUN USE KAREIN?
 * ────────────────────────────────────────────────────────────────
 * - Library ke bina, humein manually RSA key information handle 
 *   karni padti, jaise:
 *   - modulus
 *   - exponent
 *   - encoding
 *   - JWK structure
 * - Library standard JWK format mein conversion handle kar leti hai.
*/

/**
 * ────────────────────────────────────────────────────────────────
 * 51. COMPLETE AUTHENTICATION ARCHITECTURE
 * ────────────────────────────────────────────────────────────────
 * - Ab sab kuch ek saath jodte hain.
 *
 *                     LOGIN
 *                       |
 *                       ↓
 *                   Client
 *                       |
 *                       | POST /auth/login
 *                       ↓
 *                 Login Validator
 *                       |
 *                       ↓
 *                 AuthController
 *                       |
 *              ┌────────┼─────────┐
 *              ↓        ↓         ↓
 *         UserService  Credential  TokenService
 *              |       Service        |
 *              ↓          |            |
 *           Database      |            |
 *                         |            |
 *                         ↓            ↓
 *                     bcrypt       JWT creation
 *                                       |
 *                            ┌──────────┴──────────┐
 *                            ↓                     ↓
 *                      Access Token          Refresh Token
 *                            |                     |
 *                            └──────────┬──────────┘
 *                                       ↓
 *                                    Cookies
 *
 *
 *                     PROTECTED REQUEST
 *                            |
 *                            ↓
 *                     GET /auth/self
 *                            |
 *                            ↓
 *                     authenticate
 *                            |
 *                            ↓
 *                       getToken()
 *                            |
 *                     ┌──────┴──────┐
 *                     ↓             ↓
 *               Authorization     Cookie
 *                  Header       accessToken
 *                     \             /
 *                      \           /
 *                       ↓         ↓
 *                        JWT Token
 *                            |
 *                            ↓
 *                          kid
 *                            |
 *                            ↓
 *                     JWKS Endpoint
 *                            |
 *                            ↓
 *                     Matching JWK
 *                            |
 *                            ↓
 *                      Public Key
 *                            |
 *                            ↓
 *                     Verify JWT
 *                            |
 *                     ┌──────┴──────┐
 *                     ↓             ↓
 *                  Invalid        Valid
 *                     ↓             ↓
 *                  401          req.auth
 *                                   |
 *                                   ↓
 *                          AuthController.self()
 *                                   |
 *                                   ↓
 *                          userService.findById()
 *                                   |
 *                                   ↓
 *                               Database
 *                                   |
 *                                   ↓
 *                                 User
 *                                   |
 *                                   ↓
 *                            Password hatao
 *                                   |
 *                                   ↓
 *                               Response
 *
 *
 * SYSTEM-LEVEL VIEW (Architecture -- ek dusra angle)
 *
 *   ┌─────────┐   1. login     ┌───────────────┐   2. verify user   ┌──────────┐
 *   │ Browser │ ─────────────> │  Auth Service │ ─────────────────> │ Postgres │
 *   └─────────┘                └───────────────┘ <───────────────── └──────────┘
 *        ^   |                        |  ^
 *        |   | 3. Set-Cookie          |  | private.pem (sign)
 *        |   |   (access+refresh)     |  |
 *        |   v                        v  |
 *        |  cookies              /.well-known/jwks.json (public JWK)
 *        |                              |
 *        |  4. GET /auth/self           | 5. public key fetch (cache)
 *        └────────────────────> authenticate middleware
 *                                       |
 *                                6. verify -> req.auth -> controller -> safe response
*/

/**
 * ────────────────────────────────────────────────────────────────
 * 52. COMPLETE PROJECT FLOW
 * ────────────────────────────────────────────────────────────────
 * - Poori application aise yaad rakh sakte ho:
 *   > DATABASE SETUP
 *   > AppDataSource
 *   > Repository
 *   > Services
 *   > Controller
 *   > Routes
 *   > HTTP Request
 *
 * - Authentication ye add karta hai:
 *   > Login
 *   > Credentials verify karo
 *   > JWT banao
 *   > Token ko cookie mein store karo
 *   > Protected request
 *   > Token extract karo
 *   > kid padho
 *   > JWKS se JWK lo
 *   > JWT verify karo
 *   > req.auth
 *   > Controller
 *   > Database
 *   > Safe response
*/

/**
 * ────────────────────────────────────────────────────────────────
 * 53. SABSE IMPORTANT CONCEPTS YAAD RAKHNE KE LIYE
 * ────────────────────────────────────────────────────────────────
 *
 * 1. DEPENDENCY INJECTION
 *    - Class apni dependency khud nahi banati.
 *    - Dependency bahar se di jaati hai.
 *
 * 2. DATASOURCE
 *    - AppDataSource
 *         ↓
 *    - Database connection/configuration
 *
 * 3. REPOSITORY
 *    - getRepository(User)
 *         ↓
 *    - User entity ki Repository
 *
 * 4. SERVICE
 *    - Business logic rakhti hai.
 *    - Example:
 *      - UserService
 *      - TokenService
 *      - CredentialService
 *
 * 5. CONTROLLER
 *     - HTTP-level operations handle karta hai.
 *     - Example: AuthController
 *
 * 6. ROUTE
 *    - HTTP endpoint ko middleware/controller se connect karta hai.
 *
 * 7. ACCESS TOKEN
 *    - Chhoti lifetime wala token jo protected APIs access karne ke liye use hota hai.
 *
 * 8. REFRESH TOKEN
 *    - Lambi lifetime wala token jo token-refresh flow ka part hai.
 *
 * 9. PRIVATE KEY
 *    - JWT sign karne ke liye use hoti hai.
 *
 * 10. PUBLIC KEY
 *     - JWT verify karne ke liye use hoti hai.
 *
 * 11. JWT
 *     - Claims + signature wala token.
 *
 * 12. PEM
 *     - Cryptographic keys store karne ke liye commonly use hone wala format.
 *
 * 13. JWK
 *     - Ek cryptographic key JSON ke roop mein.
 *
 * 14. JWKS
 *     - JWKs ka collection.
 *
 * 15. kid
 *     - Batata hai ki JWT verify karne ke liye kaunsi key use karni hai.
 *
 * 16. httpOnly
 *     - Normal client-side JavaScript ko cookie directly read karne se rokta hai.
*/

/**
 * ────────────────────────────────────────────────────────────────
 * 54. FINAL MEMORY MAP
 * ────────────────────────────────────────────────────────────────
 * - Agar sirf ek diagram yaad rakhna ho, to ye yaad rakho:
 *
 *  1. DEPENDENCY INJECTION
 *     AppDataSource
 *           |
 *           ↓
 *     Repository
 *           |
 *           ↓
 *        Service
 *           |
 *           ↓
 *      Controller
 *           |
 *           ↓
 *         Route
 *
 *
 * 2. AUTHENTICATION
 *
 *     Login Request
 *           |
 *           ↓
 *     Validate
 *           |
 *           ↓
 *     User Dhundo
 *           |
 *           ↓
 *     Password Check
 *           |
 *           ↓
 *     JWT Banao
 *           |
 *           ↓
 *        Cookie
 *           |
 *           ↓
 *     Protected Request
 *           |
 *           ↓
 *     JWT Lo
 *           |
 *           ↓
 *     kid Padho
 *           |
 *           ↓
 *         JWKS
 *           |
 *           ↓
 *     Public Key
 *           |
 *           ↓
 *     JWT Verify
 *           |
 *           ↓
 *     req.auth
 *           |
 *           ↓
 *     User Dhundo
 *           |
 *           ↓
 *     Password Hatao
 *           |
 *           ↓
 *     Safe Response
 *
 *
 * 3. KEY RELATIONSHIPS
 *
 *     Private Key
 *         ↓
 *     SIGN
 *         ↓
 *        JWT
 *         ↓
 *     kid
 *         ↓
 *       JWKS
 *         ↓
 *       JWK
 *         ↓
 *     Public Key
 *         ↓
 *     JWT VERIFY
 */
```