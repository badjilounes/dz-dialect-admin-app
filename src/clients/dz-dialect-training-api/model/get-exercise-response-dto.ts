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
import { GetExerciseCourseResponseDto } from './get-exercise-course-response-dto';


export interface GetExerciseResponseDto { 
    id: string;
    name: string;
    description: string;
    courses: Array<GetExerciseCourseResponseDto>;
    order: number;
    createdAt: string;
    updatedAt: string;
}

