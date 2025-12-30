use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};
use strum::Display;

/// Inventory category enum for vendor inventory items
/// This enum is stored as a string in the database
#[derive(
    Debug, Clone, PartialEq, Eq, EnumIter, DeriveActiveEnum, Serialize, Deserialize, Display,
)]
#[sea_orm(rs_type = "String", db_type = "Text")]
#[strum(serialize_all = "snake_case")]
pub enum InventoryCategory {
    #[sea_orm(string_value = "drink")]
    Drink,
    #[sea_orm(string_value = "food")]
    Food,
    #[sea_orm(string_value = "merchandise")]
    Merchandise,
}

impl TryFrom<&str> for InventoryCategory {
    type Error = String;

    fn try_from(s: &str) -> Result<Self, Self::Error> {
        match s {
            "drink" => Ok(InventoryCategory::Drink),
            "food" => Ok(InventoryCategory::Food),
            "merchandise" => Ok(InventoryCategory::Merchandise),
            _ => Err(format!(
                "Invalid category '{}'. Valid options: drink, food, merchandise",
                s
            )),
        }
    }
}

impl TryFrom<String> for InventoryCategory {
    type Error = String;

    fn try_from(s: String) -> Result<Self, Self::Error> {
        s.as_str().try_into()
    }
}
