#include <stdio.h>
#include <string.h>
#include <ctype.h>
/*Defined Constants*/
#define unit_per_subject 3
#define min_year_level 1
#define max_year_level 5
#define min_course_code 1
#define max_course_code 8
#define num_courses 8
#define prelim_rate 0.53
#define midterm_rate 0.64
#define semi_final_rate 0.75
#define final_rate 1.00
#define max_subject 8
#define array_index_offset 1
#define null_var '\0'
#define min_subject 1
#define CS 1
#define IT 2
#define BA 3
#define ACC 4
#define MATH 5
#define CPE 6
#define NURSING 7
#define PSYCH 8

int main () {
    /*Memory Constants*/
    const float tuition_fees[num_courses] = {356.75, 357.75, 345.94, 312.62, 378.44, 326.11, 310.45, 399.79};
    const float reg_fees[num_courses] = {545.00, 550.00, 555.00, 560.00, 565.00, 570.00, 610.00, 624.00};
    const float misc_fees[num_courses] = {1000.45, 1050.35, 1100.25, 1150.15, 1200.05, 1249.95, 1299.85, 1349.75};
    const float lab_fees[num_courses] = {1900.75, 1920.20, 1939.65, 1959.10, 1978.55, 1998.00, 2017.45, 2036.90};

    int totalUnits, index, course_code, num_subjects, year_level;
    float tuitionPerUnit, totalTuition, regFee, miscFee, labFee, totalFee;
    float prelimAssessment, midtermAssessment, semiFinalAssessment, finalAssessment;
    char id_num[20], fname[30], lname[30], mName[30], gender[20];
    char courseDescription[50];
    int input_success; /*checks if user enters integer only from scanf*/

    printf("Enter Student Data or put NA if not applicable.\n");
    printf("-----------------------------------------------\n");

    printf("Enter your ID#: ");
    fgets(id_num, sizeof(id_num), stdin);
    id_num[strcspn(id_num, "\n")] = null_var; /*remove \n*/
    if (id_num[0] == null_var || ispunct(id_num[0]))
    {
     printf("\nSorry. ID Number is invalid or empty. Please check your data.\n");
     return 1;
    }

    printf("Enter your First Name: ");
    fgets(fname, sizeof(fname), stdin);
    fname[strcspn(fname, "\n")] = null_var;
    if (fname[0] == null_var || isdigit(fname[0]) || ispunct(fname[0]))
    {
     printf("\nSorry. First Name is invalid or empty. Please check your data.\n");
     return 1;
    }

    printf("Enter your Last Name: ");
    fgets(lname, sizeof(lname), stdin);
    lname[strcspn(lname, "\n")] = null_var;
    if (lname[0] == null_var || isdigit(lname[0]) || ispunct(lname[0]))
    {
     printf("\nSorry. Last Name is invalid or empty. Please check your data.\n");
     return 1;
    }

    printf("Enter your Middle Name: ");
    fgets(mName, sizeof(mName), stdin);
    mName[strcspn(mName, "\n")] = null_var;
    if (mName[0] == null_var || isdigit(mName[0]) || ispunct(mName[0]))
    {
     printf("\nSorry. Middle Name is invalid or empty. Please check your data.\n");
     return 1;
    }

    printf("Enter your Course Code (1-8): ");
    input_success = scanf("%d",&course_code);
    getchar(); /*removes newline*/
    if (course_code < min_course_code || course_code > max_course_code)
    {
     printf("\nSorry. Course Code is invalid. Please check your data.\n");
     return 1;
    }

    printf("Enter your Gender: ");
    fgets(gender, sizeof(gender), stdin);
    gender[strcspn(gender, "\n")] = null_var;
    if (gender[0] == null_var || isdigit(gender[0]) || ispunct(gender[0]))
    {
     printf("\nSorry. Gender cannot be empty. Please check your data.\n");
     return 1;
    }

    printf("Enter your Year Level (1-5): ");
    input_success = scanf("%d",&year_level);
    getchar();
    if (year_level < min_year_level || year_level > max_year_level)
    {
     printf("\nSorry. Year Level is invalid or empty. Please check your data.\n");
     return 1;
    }

    printf("Enter the Number of Subjects (1-8): ");
    input_success = scanf("%d",&num_subjects);
    getchar();
    if (num_subjects < min_subject || num_subjects > max_subject)
    {
     printf("\nSorry. Number of Subjects is invalid. Only 1-8 is allowed.\n");
     return 1;
    }
    /*formula*/
    totalUnits = num_subjects * unit_per_subject;
    index = course_code - array_index_offset;
    tuitionPerUnit = tuition_fees[index];
    totalTuition = totalUnits * tuitionPerUnit;
    regFee = reg_fees[index];
    miscFee = misc_fees[index];
    labFee = lab_fees[index];
    totalFee = totalTuition + regFee + miscFee + labFee;
    prelimAssessment = totalFee * prelim_rate;
    midtermAssessment = totalFee * midterm_rate;
    semiFinalAssessment = totalFee * semi_final_rate;
    finalAssessment = totalFee * final_rate;

    printf("\nStudent Accounting System\n");
    printf("--------------------------\n");
    if (course_code == CS)
    {
     strcpy(courseDescription, "Bachelor of Science in Computer Science");
    }
    else if (course_code == IT)
    {
     strcpy(courseDescription, "Bachelor of Science in Information Technology");
    }
    else if (course_code == BA)
    {
     strcpy(courseDescription, "Bachelor of Science in Business Administration");
    }
    else if (course_code == ACC)
    {
     strcpy(courseDescription, "Bachelor of Science in Accountancy");
    }
    else if (course_code == MATH)
    {
     strcpy(courseDescription, "Bachelor of Science in Mathematics");
    }
    else if (course_code == CPE)
    {
     strcpy(courseDescription, "Bachelor of Science in Computer Engineering");
    }
    else if (course_code == NURSING)
    {
     strcpy(courseDescription, "Bachelor of Science in Nursing");
    }
    else
    {
     strcpy(courseDescription, "Bachelor of Science in Psychology");
    }
    /*FOR OUTPUT*/
    printf("Course Description:        %s\n",courseDescription);
    printf("Total Units:               %d\n",totalUnits);
    printf("Tuition Per Unit:      PHP %.2f\n",tuitionPerUnit);
    printf("Total Tuition:         PHP %.2f\n",totalTuition);
    printf("Registration Fee:      PHP %.2f\n",regFee);
    printf("Miscellaneous Fee:     PHP %.2f\n",miscFee);
    printf("Laboratory Fee:        PHP %.2f\n",labFee);
    printf("Total Fee:             PHP %.2f\n",labFee);
    printf("Prelim Assessment:     PHP %.2f\n",prelimAssessment);
    printf("Midterm Assessment:    PHP %.2f\n",midtermAssessment);
    printf("Semi Final Assessment: PHP %.2f\n",semiFinalAssessment);
    printf("Final Assessment:      PHP %.2f\n",finalAssessment);

    return 0;
}
