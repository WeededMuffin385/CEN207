use std::env;
use strum_macros::EnumString;

#[derive(Debug, Clone, Copy, PartialEq, Eq, EnumString)]
#[strum(serialize_all = "snake_case")]
pub enum DeploymentProfile {
    Aws,
    Local,
    LocalAws,
}

pub fn deployment_profile_from_env() -> DeploymentProfile {
    env::var("DEPLOYMENT_PROFILE")
        .expect("DEPLOYMENT_PROFILE must be set")
        .parse()
        .expect("DEPLOYMENT_PROFILE must be one of: aws, local, local_aws")
}