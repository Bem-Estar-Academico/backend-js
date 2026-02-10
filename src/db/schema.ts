import { integer, pgTable, varchar, timestamp, boolean, pgEnum, json, numeric, text } from "drizzle-orm/pg-core";
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

export const periodsTable = pgTable("periods", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull().unique(),
    initDate: timestamp("init_date", { withTimezone: true }).notNull(),
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
    description: text().notNull(),
    foodAllowance: boolean("food_allowance").notNull().default(false),
    housingAllowance: boolean("housing_allowance").notNull().default(false),
    daycareAllowance: boolean("daycare_allowance").notNull().default(false),
    graduationScholarship: boolean("graduation_scholarship").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
});

export const editalDocumentsTable = pgTable("edital_documents", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    editalId: integer('edital_id').notNull().references(() => editaisTable.id),
    name: varchar({ length: 255 }).notNull(),
    fileKey: varchar('file_key', { length: 512 }).notNull(),
    fileType: varchar('file_type', { length: 50 }),
    fileSize: integer('file_size'),
    uploadedAt: timestamp('uploaded_at', { withTimezone: true }).notNull().defaultNow(),
});

export const editalTeamsTable = pgTable("edital_teams", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    editalId: integer('edital_id').notNull().references(() => editaisTable.id),
    userId: integer('user_id').notNull().references(() => usersTable.id),
    assignedAt: timestamp('assigned_at', { withTimezone: true }).notNull().defaultNow(),
});

export const studentRegistrationsTable = pgTable("student_registrations", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    studentId: integer('student_id').notNull().references(() => usersTable.id),
    editalId: integer('edital_id').notNull().references(() => editaisTable.id),
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
});

export const studentDocumentsTable = pgTable("student_documents", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    studentRegistrationId: integer('student_registration_id').notNull().references(() => studentRegistrationsTable.id),
    name: varchar({ length: 255 }).notNull(),
    fileKey: varchar('file_key', { length: 512 }).notNull(),
    fileType: varchar('file_type', { length: 50 }),
    fileSize: integer('file_size'),
    uploadedAt: timestamp('uploaded_at', { withTimezone: true }).notNull().defaultNow(),
    description: text(),
});

export const reviewRegistrationsTable = pgTable("review_registrations", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    socialWorkerId: integer('social_worker_id').references(() => usersTable.id),
    studentRegistrationId: integer('student_registration_id').notNull().unique().references(() => studentRegistrationsTable.id),
    review: json(),
    status: registrationStatusEnum().notNull().default('PENDING'),
    ivs: numeric({ precision: 3 }),
    approvedFoodAllowance: boolean('approved_food_allowance').notNull().default(false),
    approvedHousingAllowance: boolean('approved_housing_allowance').notNull().default(false),
    approvedDaycareAllowance: boolean('approved_daycare_allowance').notNull().default(false),
    approvedGraduationScholarship: boolean('approved_graduation_scholarship').notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
});

export const appealsTable = pgTable("appeals", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    reviewRegistrationId: integer('review_registration_id').notNull().references(() => reviewRegistrationsTable.id),
    requestedDocuments: json('requested_documents'),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
    fulfilledAt: timestamp("fulfilled_at", { withTimezone: true }),
});

const relations = defineRelations({
    editaisTable, appealsTable, studentRegistrationsTable, editalDocumentsTable,
    studentDocumentsTable, usersTable, reviewRegistrationsTable, editalTeamsTable,
}, (r: any) => ({
    editalDocumentsTable: {
        edital: r.one.editaisTable({
            from: r.editalDocumentsTable.editalId,
            to: r.editaisTable.id,
        }),
    },
    editaisTable: {
        documents: r.many.editalDocumentsTable(),
        registrations: r.many.studentRegistrationsTable(),
        teamMembers: r.many.editalTeamsTable(),
    },
    editalTeamsTable: {
        edital: r.one.editaisTable({
            from: r.editalTeamsTable.editalId,
            to: r.editaisTable.id,
        }),
        user: r.one.usersTable({
            from: r.editalTeamsTable.userId,
            to: r.usersTable.id,
        }),
    },
    reviewRegistrationsTable: {
        socialWorker: r.one.usersTable({
            from: r.reviewRegistrationsTable.socialWorkerId,
            to: r.usersTable.id,
        }),
        studentRegistration: r.one.studentRegistrationsTable({
            from: r.reviewRegistrationsTable.studentRegistrationId,
            to: r.studentRegistrationsTable.id,
        }),
        appeals: r.many.appealsTable(),
    },
    usersTable: {
        reviewRegistrations: r.many.reviewRegistrationsTable(),
        studentRegistrations: r.many.studentRegistrationsTable(),
    },
    studentRegistrationsTable: {
        student: r.one.usersTable({
            from: r.studentRegistrationsTable.studentId,
            to: r.usersTable.id,
        }),
        review: r.one.reviewRegistrationsTable({
            from: r.studentRegistrationsTable.id,
            to: r.reviewRegistrationsTable.studentRegistrationId,
        }),
        edital: r.one.editaisTable({
            from: r.studentRegistrationsTable.editalId,
            to: r.editaisTable.id,
        }),
        documents: r.many.studentDocumentsTable(),
    },
    studentDocumentsTable: {
        studentRegistration: r.one.studentRegistrationsTable({
            from: r.studentDocumentsTable.studentRegistrationId,
            to: r.studentRegistrationsTable.id,
        }),
    },
    appealsTable: {
        reviewRegistration: r.one.reviewRegistrationsTable({
            from: r.appealsTable.reviewRegistrationId,
            to: r.reviewRegistrationsTable.id,
        }),
    },
}))