use anyhow::Result;
use turbo_rcstr::RcStr;
use turbo_tasks::{ResolvedVc, ValueToString, Vc};
use turbopack_core::{
    chunk::{ChunkableModuleReference, ChunkingType, ChunkingTypeOption},
    module::Module,
    reference::ModuleReference,
    resolve::ModuleResolveResult,
};

#[turbo_tasks::value]
pub struct NextServerComponentModuleReference {
    asset: ResolvedVc<Box<dyn Module>>,
}

#[turbo_tasks::value_impl]
impl NextServerComponentModuleReference {
    #[turbo_tasks::function]
    pub fn new(asset: ResolvedVc<Box<dyn Module>>) -> Vc<Self> {
        NextServerComponentModuleReference { asset }.cell()
    }
}

#[turbo_tasks::value_impl]
impl ValueToString for NextServerComponentModuleReference {
    #[turbo_tasks::function]
    async fn to_string(&self) -> Result<Vc<RcStr>> {
        Ok(Vc::cell(
            format!(
                "Next.js Server Component {}",
                self.asset.ident().to_string().await?
            )
            .into(),
        ))
    }
}

#[turbo_tasks::value_impl]
impl ModuleReference for NextServerComponentModuleReference {
    #[turbo_tasks::function]
    fn resolve_reference(&self) -> Vc<ModuleResolveResult> {
        *ModuleResolveResult::module(self.asset)
    }
}

#[turbo_tasks::value_impl]
impl ChunkableModuleReference for NextServerComponentModuleReference {
    #[turbo_tasks::function]
    fn chunking_type(&self) -> Vc<ChunkingTypeOption> {
        Vc::cell(Some(ChunkingType::Shared {
            inherit_async: true,
            merge_tag: None,
        }))
    }
}
