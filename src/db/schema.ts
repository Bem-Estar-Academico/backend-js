import { integer, pgTable, varchar, timestamp, boolean, pgEnum, json, numeric } from "drizzle-orm/pg-core";
import { defineRelations } from 'drizzle-orm';

export const roleEnum = pgEnum('role', ['NTI', 'STUDENT', 'COORDINATOR', 'ASSISTENTE_SOCIAL']);
export const registrationStatusEnum = pgEnum('registration_status', ['PENDING', 'APPROVED', 'REJECTED', 'APPEAL', 'REVIEW', 'CANCELLED']);
export const usersTable = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    email: varchar({ length: 255 }).notNull().unique(),
    name: varchar({ length: 255 }).notNull(),
    role: roleEnum().notNull(),
    registrationNumber: varchar('registration_number', { length: 50 }).unique(),
    cpf: varchar({ length: 14 }).notNull().unique(),
    passwordHash: varchar('password_hash', { length: 255 }).notNull(),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),

});

export const studentRegistrationsTable = pgTable("student_registrations", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    studentId: integer('student_id').notNull(),
    editalId: integer('edital_id').notNull(),
    answer: json(),
    requestFoodAllowance: boolean('request_food_allowance').default(false),
    requestHousingAllowance: boolean('request_housing_allowance').default(false),
    requestDaycareAllowance: boolean('request_daycare_allowance').default(false),
    requestGraduationScholarship: boolean('request_graduation_scholarship').default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),

})

export const reviewRegistrationsTable = pgTable("review_registrations", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    socialWorkerId: integer('social_worker_id').notNull(),
    studentId: integer('student_id').notNull(),
    data: json().notNull(),
    status: registrationStatusEnum().notNull().default('PENDING'),
    ivs: numeric({ precision: 2}),
    approvedFoodAllowance: boolean('approved_food_allowance').default(false),
    approvedHousingAllowance: boolean('approved_housing_allowance').default(false),
    approvedDaycareAllowance: boolean('approved_daycare_allowance').default(false),
    approvedGraduationScholarship: boolean('approved_graduation_scholarship').default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
})

export const semestersTable = pgTable("semesters", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 50 }).notNull().unique(),
    startDate: timestamp("start_date", { withTimezone: true }).notNull(),
    endDate: timestamp("end_date", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
    
});

export const editaisTable = pgTable("editais", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    title: varchar({ length: 255 }).notNull(),
    registrationStartDate: timestamp("registration_start_date", { withTimezone: true }).notNull(),
    registrationEndDate: timestamp("registration_end_date", { withTimezone: true }),
    appealStartDate: timestamp("appeal_start_date", { withTimezone: true }),
    appealEndDate: timestamp("appeal_end_date", { withTimezone: true }),
    preliminaryResultDate: timestamp("preliminary_result_date", { withTimezone: true }),
    finalResultDate: timestamp("final_result_date", { withTimezone: true }),
    description: varchar({ length: 255 }).notNull(),
    foodAllowance: boolean("food_allowance"),
    housingAllowance: boolean("housing_allowance",),
    daycareAllowance: boolean("daycare_allowance",),
    graduationScholarship: boolean("graduation_scholarship",),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
});

export const documentsTable = pgTable("documents", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    editalId: integer('edital_id').notNull(),
    name: varchar({ length: 255 }).notNull(),
    fileKey: varchar('file_key', { length: 255 }).notNull(),
    fileType: varchar('file_type', { length: 50 }),
    fileSize: integer(),
    uploadedAt: timestamp('uploaded_at', { withTimezone: true }).notNull().defaultNow(),
})

export const appealsTable = pgTable("appeals", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    filledAt: timestamp('filled_at', { withTimezone: true }),
    requestedDocuments: json('requested_documents'),
    reviewRegistrationId: integer('review_registration_id').notNull(),
    // TODO: Requested documents

})

const relations = defineRelations({ editaisTable, appealsTable, studentRegistrationsTable, documentsTable, usersTable, reviewRegistrationsTable }, (r) => (
    {
        documentsTable: {
            editaisTable: r.one.editaisTable({
                from: r.documentsTable.editalId,
                to: r.editaisTable.id,
            })
        },
        editaisTable: {
            documentsTable: r.many.documentsTable(),
            studentRegistrationsTable: r.many.studentRegistrationsTable()
        },
        reviewRegistrationsTable: {
            usersTable: r.one.usersTable({
                from: r.reviewRegistrationsTable.studentId,
                to: r.usersTable.id,
            }),
            studentRegistrationsTable: r.one.studentRegistrationsTable({
                from: r.reviewRegistrationsTable.studentId,
                to: r.studentRegistrationsTable.studentId,
            }),
            appealsTable: r.many.appealsTable()
        },
        usersTable: {
            reviewRegistrationsTable: r.many.reviewRegistrationsTable(),
            studentRegistrationsTable: r.many.studentRegistrationsTable(),
            usersTable: r.many.usersTable()
        },
        studentRegistrationsTable: {
            usersTable: r.one.usersTable({
                from: r.studentRegistrationsTable.studentId,
                to: r.usersTable.id,
            }),
            reviewRegistrationsTable: r.one.reviewRegistrationsTable({
                from: r.studentRegistrationsTable.studentId,
                to: r.reviewRegistrationsTable.studentId,
            }),
            editaisTable: r.one.editaisTable({
                from: r.studentRegistrationsTable.editalId,
                to: r.editaisTable.id,
            })
            // TODO: Fazer a relação com documentos
        }, 
        appealsTable: {
            reviewRegistrationsTable: r.one.reviewRegistrationsTable({
                from: r.appealsTable.reviewRegistrationId,
                to: r.reviewRegistrationsTable.id,
            })
        }   
    }
))