/**
 * DzDialect Training API
 * DzDialect Training API Documentation
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { CreateExamResponseQuestionDto } from './create-exam-response-question-dto';


export interface ExamResponseDto { 
    id: string;
    name: string;
    courseId: string;
    questions: Array<CreateExamResponseQuestionDto>;
    order: number;
    createdAt: string;
    updatedAt: string;
}

