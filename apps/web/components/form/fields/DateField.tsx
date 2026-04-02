import { FormItemWrapper } from "@/components/form/FormItemWrapper";
import { useTemplateFormItem } from "@/components/form/TemplateFormItem";
import { cn } from "@repo/ui/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Button } from "@repo/ui/components/button";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Calendar } from "@repo/ui/components/calendar";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@repo/ui/components/drawer";
import { ChangeEvent, ChangeEventHandler, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { toast } from "@repo/ui/components/sonner";

function handleCalendarChange(
  value: string | number,
  event: ChangeEventHandler<HTMLSelectElement>,
) {
  const newEvent = {
    target: { value: String(value) },
  } as ChangeEvent<HTMLSelectElement>;
  event(newEvent);
}

export function DateField() {
  const { field, className, labelPosition = "top" } = useTemplateFormItem();
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState<Date>(new Date());

  return (
    <>
      <FormItemWrapper
        className={cn(
          className,
          labelPosition === "left" ? "flex flex-0 items-center" : "flex-0",
        )}
      >
        <div className="flex w-full items-center gap-2">
          <div className="relative flex items-center gap-2 w-full">
            <Drawer open={open} onOpenChange={setOpen}>
              <DrawerTrigger asChild>
                <Button
                  type="button"
                  className={cn(
                    "justify-start text-left font-normal w-full",
                    !field.value && "text-muted-foreground",
                  )}
                  variant="outline"
                  onClick={(e) => e.currentTarget.blur()}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {field.value ? (
                    `${format(field.value, "PPP", { locale: ko })}`
                  ) : (
                    <span>날짜를 선택하세요</span>
                  )}
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>날짜</DrawerTitle>
                  <DrawerDescription>날짜를 선택하세요</DrawerDescription>
                </DrawerHeader>
                <div className="divide-y bg-background flex flex-col items-center">
                  <div>
                    <Calendar
                      mode="single"
                      onSelect={field.onChange}
                      selected={field.value}
                      locale={ko}
                      captionLayout="dropdown"
                      endMonth={new Date(new Date().getFullYear() + 10, 11)}
                      components={{
                        MonthCaption: (props) => <>{props.children}</>,
                        DropdownNav: (props) => (
                          <div className="flex w-full items-center gap-2">
                            {props.children}
                          </div>
                        ),
                        Dropdown: ({ onChange, value, options }) => (
                          <Select
                            onValueChange={(v) => {
                              if (onChange) {
                                handleCalendarChange(v, onChange);
                              }
                            }}
                            value={String(value)}
                          >
                            <SelectTrigger className="first:flex-1 last:shrink-0">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {options?.map((option) => (
                                <SelectItem
                                  disabled={option.disabled}
                                  key={option.value}
                                  value={String(option.value)}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ),
                      }}
                      hideNavigation
                      month={month}
                      onMonthChange={setMonth}
                    />

                    <Button
                      type="button"
                      className="w-full"
                      onClick={() => {
                        if (!field.value)
                          return toast.warning("날짜를 선택하세요");

                        setOpen(false);
                      }}
                    >
                      확인
                    </Button>
                  </div>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </FormItemWrapper>
    </>
  );
}
