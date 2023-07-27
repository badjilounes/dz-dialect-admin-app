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


export interface GetExamListTrainingCourseExamQuestionResponseDto { 
    id: string;
    type: GetExamListTrainingCourseExamQuestionResponseDto.TypeEnum;
    question: string;
    propositions: Array<string>;
    answer: Array<string>;
}
export namespace GetExamListTrainingCourseExamQuestionResponseDto {
    export type TypeEnum = 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'WORD_LIST';
    export const TypeEnum = {
        SINGLE_CHOICE: 'SINGLE_CHOICE' as TypeEnum,
        MULTIPLE_CHOICE: 'MULTIPLE_CHOICE' as TypeEnum,
        WORD_LIST: 'WORD_LIST' as TypeEnum
    };
}


