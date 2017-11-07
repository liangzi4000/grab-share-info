-- Check where is the playground database? in 233? or in UAT?

IF NOT EXISTS (SELECT 1 FROM SYS.SCHEMAS WHERE name = 'EST')
BEGIN
	EXEC('CREATE SCHEMA [EST]')
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
