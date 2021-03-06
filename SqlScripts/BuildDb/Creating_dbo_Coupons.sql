CREATE TABLE [dbo].[Coupons]
(
[Id] [nvarchar] (50) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
[Created] [datetime] NOT NULL CONSTRAINT [DF_Coupons_Created] DEFAULT (getdate()),
[Used] [datetime] NULL,
[Canceled] [datetime] NULL,
[Amount] [money] NULL,
[DivId] [int] NULL,
[OrgId] [int] NULL,
[PeopleId] [int] NULL,
[Name] [nvarchar] (80) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
[UserId] [int] NULL,
[RegAmount] [money] NULL,
[DivOrg] AS (case  when [divid] IS NOT NULL then 'div.'+CONVERT([nvarchar],[divid],(0)) else 'org.'+CONVERT([nvarchar],[orgid],(0)) end),
[MultiUse] [bit] NULL,
[Generated] [bit] NULL
)
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO
