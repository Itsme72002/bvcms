ALTER TABLE [dbo].[Roles] ADD CONSTRAINT [PK_Roles] PRIMARY KEY CLUSTERED  ([RoleId])
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO
