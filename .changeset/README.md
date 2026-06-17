# Changesets

This directory manages versioning and changelog generation via [@changesets/cli](https://github.com/changesets/changesets).

## Workflow

### 1. 记录变更

每次完成一个功能或修复后，运行：

```bash
pnpm changeset
```

按提示选择 bump 类型（`major` / `minor` / `patch`）并填写描述，会在此目录生成一个 `.md` 文件。

### 2. 更新版本

准备发布时，将所有待发布的 changeset 合并，自动 bump 版本并更新 CHANGELOG.md：

```bash
pnpm version-packages
```

### 3. 构建并发布

```bash
pnpm release
```

等价于 `pnpm run build` 后执行 `changeset publish`，将 `dist/` 发布到 npm。

## Bump 类型参考

| 类型 | 场景 |
|------|------|
| `patch` | Bug 修复、文档、样式调整、内部重构 |
| `minor` | 新增功能（向后兼容） |
| `major` | 破坏性变更（API 不兼容） |
