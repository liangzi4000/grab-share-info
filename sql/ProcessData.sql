
TRUNCATE TABLE [EST].[yjbb_data]
GO
INSERT INTO [EST].[yjbb_data] ([Code],[CutoffDate],[EPS], [EPSDeduct],[Revenue],[RevenueYoy],[RevenueQoq],[Profit],[ProfitYoy],[ProfiltQoq],[NAVPerUnit],[ROE],[CashPerUnit],[GrossProfitRate],[Distribution],[DividenRate],[AnnounceDate])
SELECT [Code],[CutoffDate],
CASE EPS WHEN '-' THEN NULL ELSE EPS END,
CAST(CONVERT(float, [EPSDeduct]) as decimal(15,4)),
CASE [Revenue] WHEN '-' THEN NULL ELSE CAST(REPLACE(REPLACE(REPLACE([Revenue],N'万',N'0000'),N'亿',N'00000000'),'.','') AS decimal(18,0))/100 END,
CASE [RevenueYoy] WHEN '-' THEN NULL ELSE [RevenueYoy] END,
CASE [RevenueQoq] WHEN '-' THEN NULL ELSE [RevenueQoq] END,
CASE [Profit] WHEN '-' THEN NULL ELSE CAST(REPLACE(REPLACE(REPLACE([Profit],N'万',N'0000'),N'亿',N'00000000'),'.','') AS decimal(18,0))/100 END,
CASE [ProfitYoy] WHEN '-' THEN NULL ELSE [ProfitYoy] END,
CASE [ProfiltQoq] WHEN '-' THEN NULL ELSE [ProfiltQoq] END,
[NAVPerUnit],
CASE [ROE] WHEN '-' THEN NULL ELSE [ROE] END,
[CashPerUnit],
CASE [GrossProfitRate] WHEN '-' THEN NULL ELSE [GrossProfitRate] END,
CASE [Distribution] WHEN '-' THEN NULL ELSE [Distribution] END,
CASE [DividenRate] WHEN '-' THEN NULL ELSE [DividenRate] END,
[AnnounceDate] FROM [EST].[yjbb]
GO