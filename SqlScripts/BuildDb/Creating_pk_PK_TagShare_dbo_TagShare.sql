ALTER TABLE [dbo].[TagShare] ADD CONSTRAINT [PK_TagShare] PRIMARY KEY CLUSTERED  ([TagId], [PeopleId])
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO
