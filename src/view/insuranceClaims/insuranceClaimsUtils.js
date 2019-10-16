export function get_insurance_claims_type_select_options() {
    var type = [];
    type.push({ value: "火險", label: "火險" });
    type.push({ value: "水險", label: "水險" });
    type.push({ value: "大廈全保", label: "大廈全保" });
    type.push({ value: "第三者保險", label: "第三者保險" });
    return type;
}