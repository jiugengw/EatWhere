/**
 * @swagger
 * components:
 *   schemas:
 *     History:
 *       type: object
 *       required:
 *         - user
 *         - restaurant
 *         - userOpinion
 *       properties:
 *         id:
 *           type: string
 *           example: "60d21b4667d0d8992e610c88"
 *         user:
 *           type: string
 *           description: ObjectId reference to User
 *           example: "60d21b4667d0d8992e610c85"
 *         group:
 *           type: string
 *           nullable: true
 *           description: ObjectId reference to Group (optional)
 *           example: "60d21b4667d0d8992e610c99"
 *         restaurant:
 *           type: object
 *           required:
 *             - placeId
 *             - name
 *             - cuisine
 *           properties:
 *             placeId:
 *               type: string
 *               example: "ChIJN1t_tDeuEmsRUsoyG83frY4"
 *             name:
 *               type: string
 *               example: "The Noodle House"
 *             cuisine:
 *               type: string
 *               example: "Chinese"
 *         userOpinion:
 *           type: object
 *           required:
 *             - rating
 *             - notes
 *           properties:
 *             rating:
 *               type: number
 *               minimum: 1
 *               maximum: 10
 *               example: 8
 *             notes:
 *               type: string
 *               example: "The food was amazing but a bit pricey."
 *         date:
 *           type: string
 *           format: date-time
 *           example: "2024-06-15T12:00:00Z"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-06-15T12:00:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2024-06-15T12:30:00Z"
 */
