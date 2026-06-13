mod database;
mod google;
mod deployment_profile;

use std::sync::Arc;
use tracing::info;
use crate::context::database::config::DatabaseConfig;
use crate::context::database::Database;
use crate::context::deployment_profile::{deployment_profile_from_env, DeploymentProfile};
use crate::context::google::Google;

#[derive(Clone)]
pub struct Context(pub Arc<InnerContext>);

impl Context {
    pub async fn new() -> Self {
        Self(Arc::new(InnerContext::new().await))
    }
}

pub struct InnerContext {
    pub database: Database,
    pub google: Google,
}

impl InnerContext {
    pub async fn new() -> Self {
        let deployment_profile = deployment_profile_from_env();
        info!("deployment_profile: {:?}", deployment_profile);

        let db_config = match deployment_profile {
            DeploymentProfile::Aws => DatabaseConfig::aws().await.unwrap(),
            DeploymentProfile::Local => DatabaseConfig::local(),
            DeploymentProfile::LocalAws => DatabaseConfig::local_aws().await.unwrap(),
        };

        let database = Database::new(db_config).await;
        let google = Google::new().await;

        Self {
            database,
            google,
        }
    }
}