export function get_minutes_type_select_options() {
    var type = [];
    type.push({ value: "常務會議", label: "常務會議" });
    type.push({ value: "年度業主大會", label: "年度業主大會" });
    type.push({ value: "特別業主大會", label: "特別業主大會" });
    type.push({ value: "特別會議", label: "特別會議" });
    return type;
}