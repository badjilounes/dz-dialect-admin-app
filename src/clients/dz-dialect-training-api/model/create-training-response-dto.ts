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
import { CreateTrainingCourseResponseDto } from './create-training-course-response-dto';


export interface CreateTrainingResponseDto { 
    id: string;
    name: string;
    description: string;
    isPresentation: boolean;
    courses: CreateTrainingCourseResponseDto;
}

