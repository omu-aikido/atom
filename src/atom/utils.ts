export const grade = [
    {
        name: "無級",
        grade: 0,
    },
    {
        name: "五級",
        grade: 5,
    },
    {
        name: "四級",
        grade: 4,
    },
    {
        name: "三級",
        grade: 3,
    },
    {
        name: "二級",
        grade: 2,
    },
    {
        name: "一級",
        grade: 1,
    },
    {
        name: "初段",
        grade: -1,
    },
    {
        name: "二段",
        grade: -2,
    },
];

export function translateGrade(grade_value: number): string {
    const grade_data = grade.find((g) => g.grade === grade_value);
    return grade_data ? grade_data.name : "不明";
}

export function timeForNextGrade(grade_value: number): number {
    switch (grade_value) {
        case 0:
            return 30;
        case 5:
            return 60;
        case 3:
            return 100;
        case 1:
            return 100;
        case -1:
            return 200;
        default:
            return 30;
    }
}