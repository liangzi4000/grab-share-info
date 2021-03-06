-- Need to manual create database before running below script

IF NOT EXISTS (SELECT 1 FROM SYS.SCHEMAS WHERE name = 'EST')
BEGIN
	EXEC('CREATE SCHEMA [EST]')
END
GO

IF NOT EXISTS (SELECT 1 FROM SYS.SCHEMAS WHERE name = 'SIA')
BEGIN
	EXEC('CREATE SCHEMA [SIA]')
END
GO


IF EXISTS (SELECT 1 FROM SYS.OBJECTS WHERE NAME = 'yjbb' AND type = 'U')
	DROP TABLE EST.yjbb
GO

CREATE TABLE EST.yjbb(
	Code char(6) not null,
	CutoffDate nvarchar(15) not null,
	EPS nvarchar(10),
	EPSDeduct nvarchar(10),
	Revenue nvarchar(10),
	RevenueYoy nvarchar(10),
	RevenueQoq nvarchar(10),
	Profit nvarchar(10),
	ProfitYoy nvarchar(10),
	ProfiltQoq nvarchar(10),
	NAVPerUnit nvarchar(10),
	ROE nvarchar(10),
	CashPerUnit nvarchar(10),
	GrossProfitRate nvarchar(10),
	Distribution nvarchar(15),
	DividenRate nvarchar(10),
	AnnounceDate nvarchar(15),
	Primary Key(Code,CutoffDate)
)
GO
----------------------------------------
IF EXISTS (SELECT 1 FROM SYS.objects WHERE name = 'Proc_yjbb_Ins' and type= 'P')
DROP PROCEDURE EST.Proc_yjbb_Ins
GO
CREATE PROCEDURE EST.Proc_yjbb_Ins
@Code char(6),
@CutoffDate nvarchar(15),
@EPS nvarchar(10),
@EPSDeduct nvarchar(10),
@Revenue nvarchar(10),
@RevenueYoy nvarchar(10),
@RevenueQoq nvarchar(10),
@Profit nvarchar(10),
@ProfitYoy nvarchar(10),
@ProfiltQoq nvarchar(10),
@NAVPerUnit nvarchar(10),
@ROE nvarchar(10),
@CashPerUnit nvarchar(10),
@GrossProfitRate nvarchar(10),
@Distribution nvarchar(15),
@DividenRate nvarchar(10),
@AnnounceDate nvarchar(15)
AS 
BEGIN
IF NOT EXISTS(SELECT 1 FROM [EST].[yjbb] WHERE Code = @Code AND CutoffDate = @CutoffDate)
INSERT INTO [EST].[yjbb]
([Code]
,[CutoffDate]
,[EPS]
,[EPSDeduct]
,[Revenue]
,[RevenueYoy]
,[RevenueQoq]
,[Profit]
,[ProfitYoy]
,[ProfiltQoq]
,[NAVPerUnit]
,[ROE]
,[CashPerUnit]
,[GrossProfitRate]
,[Distribution]
,[DividenRate]
,[AnnounceDate])
VALUES (
@Code,
@CutoffDate,
@EPS,
@EPSDeduct,
@Revenue,
@RevenueYoy,
@RevenueQoq,
@Profit,
@ProfitYoy,
@ProfiltQoq,
@NAVPerUnit,
@ROE,
@CashPerUnit,
@GrossProfitRate,
@Distribution,
@DividenRate,
@AnnounceDate)
END
GO

IF EXISTS (SELECT 1 FROM SYS.OBJECTS WHERE NAME = 'yjbb_data' AND type = 'U')
	DROP TABLE EST.yjbb_data
GO
CREATE TABLE [EST].[yjbb_data](
	[Code] [char](6) NOT NULL,
	[CutoffDate] datetime NOT NULL,
	[EPS] decimal(15,4) NULL,
	[EPSDeduct] decimal(15,4) NULL,
	[Revenue] decimal(18,2) NULL,
	[RevenueYoy] decimal(10,2) NULL,
	[RevenueQoq] decimal(10,2) NULL,
	[Profit] decimal(18,2) NULL,
	[ProfitYoy] decimal(10,2) NULL,
	[ProfiltQoq] decimal(10,2) NULL,
	[NAVPerUnit] decimal(10,4) NULL,
	[ROE] decimal(8,2) NULL,
	[CashPerUnit] decimal(10,4) NULL,
	[GrossProfitRate] decimal(10,2) NULL,
	[Distribution] [nvarchar](15) NULL,
	[DividenRate] decimal(5,2) NULL,
	[AnnounceDate] datetime NOT NULL,
	PRIMARY KEY ([Code],[CutoffDate])
)
GO

IF EXISTS (SELECT 1 FROM SYS.OBJECTS WHERE NAME = 'gsjj' AND type = 'U')
	DROP TABLE SIA.gsjj
GO
CREATE TABLE [SIA].[gsjj](
	[Code] [char](6) PRIMARY KEY NOT NULL,
	[ShortName] nvarchar(100) NOT NULL,
	[FullNameCN] nvarchar(150) NULL,
	[FullNameEN] varchar(200) NULL,
	[StockExchange] nvarchar(100) NOT NULL,
	[IPODate] datetime NOT NULL,
	[IPOPrice] decimal(5,2) NOT NULL,
	[PrimaryDistribution] nvarchar(200) NULL,
	[FoundedDate] datetime not null,
	[RegisteredCapital] nvarchar(50),
	[InstitutionType] nvarchar(50),
	[OrganizationType] nvarchar(50),
	[BoardSecretariat] nvarchar(50),
	[BoardSecretariatPhone] nvarchar(50),
	[BoardSecretariatFax] nvarchar(50),
	[BoardSecretariatEmail] nvarchar(50),
	[Postcode] nvarchar(50),
	[Phone] nvarchar(50),
	[Fax] nvarchar(50),
	[Email] nvarchar(50),
	[Website] nvarchar(100),
	[DisclosureWebsite] nvarchar(100),
	[NameChangeHistory] nvarchar(200),
	[RegisteredAddress] nvarchar(200),
	[OfficeAddress] nvarchar(200),
	[Profile] nvarchar(500),
	[BusinessScope] nvarchar(100)
)
GO

IF EXISTS (SELECT 1 FROM SYS.objects WHERE name = 'Proc_gsjj_Ins' and type= 'P')
DROP PROCEDURE SIA.Proc_gsjj_Ins
GO
CREATE PROCEDURE SIA.Proc_gsjj_Ins
@Code char(6),
@ShortName nvarchar(100),
@FullNameCN nvarchar(150),
@FullNameEN varchar(200),
@StockExchange nvarchar(100),
@IPODate datetime,
@IPOPrice decimal(5,2),
@PrimaryDistribution nvarchar(200),
@FoundedDate datetime,
@RegisteredCapital nvarchar(50),
@InstitutionType nvarchar(50),
@OrganizationType nvarchar(50),
@BoardSecretariat nvarchar(50),
@BoardSecretariatPhone nvarchar(50),
@BoardSecretariatFax nvarchar(50),
@BoardSecretariatEmail nvarchar(50),
@Postcode nvarchar(50),
@Phone nvarchar(50),
@Fax nvarchar(50),
@Email nvarchar(50),
@Website nvarchar(100),
@DisclosureWebsite nvarchar(100),
@NameChangeHistory nvarchar(200),
@RegisteredAddress nvarchar(200),
@OfficeAddress nvarchar(200),
@Profile nvarchar(500),
@BusinessScope nvarchar(100)
AS 
BEGIN
IF NOT EXISTS (SELECT 1 FROM [SIA].[gsjj] WHERE Code = @Code)
INSERT INTO [SIA].[gsjj]
([Code]
,[ShortName]
,[FullNameCN]
,[FullNameEN]
,[StockExchange]
,[IPODate]
,[IPOPrice]
,[PrimaryDistribution]
,[FoundedDate]
,[RegisteredCapital]
,[InstitutionType]
,[OrganizationType]
,[BoardSecretariat]
,[BoardSecretariatPhone]
,[BoardSecretariatFax]
,[BoardSecretariatEmail]
,[Postcode]
,[Phone]
,[Fax]
,[Email]
,[Website]
,[DisclosureWebsite]
,[NameChangeHistory]
,[RegisteredAddress]
,[OfficeAddress]
,[Profile]
,[BusinessScope])
VALUES (
@Code,
@ShortName,
@FullNameCN,
@FullNameEN,
@StockExchange,
@IPODate,
@IPOPrice,
@PrimaryDistribution,
@FoundedDate,
@RegisteredCapital,
@InstitutionType,
@OrganizationType,
@BoardSecretariat,
@BoardSecretariatPhone,
@BoardSecretariatFax,
@BoardSecretariatEmail,
@Postcode,
@Phone,
@Fax,
@Email,
@Website,
@DisclosureWebsite,
@NameChangeHistory,
@RegisteredAddress,
@OfficeAddress,
@Profile,
@BusinessScope)
END
GO